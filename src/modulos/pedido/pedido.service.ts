import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { CriaPedidoDTO } from './dto/CriaPedido.dto';
import { AtualizaPedidoDTO } from './dto/AtualizaPedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoEntity } from './pedido.entity';
import { In, Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { StatusPedido } from './enum/statuspedido.enum';
import { isUUID } from 'class-validator';
import { ItemPedidoEntity } from './itempedido.entity';
import { ProdutoEntity } from '../produto/produto.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(ProdutoEntity)
    private readonly produtoRepository: Repository<ProdutoEntity>,
  ) {}

  async cadastraPedido(
    usuarioId: string,
    dadosPedido: CriaPedidoDTO,
  ): Promise<PedidoEntity> {
    if (!isUUID(usuarioId)) {
      throw new NotFoundException('Usuário não existe');
    }

    const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });

    if (!usuario) {
      throw new NotFoundException('Usuário não existe');
    }

    const produtosId = dadosPedido.itensPedido.map(
      (itemPedido) => itemPedido.produtoId,
    );
    const produtosRelacionados = await this.produtoRepository.findBy({
      id: In(produtosId),
    });

    const pedidoEntity = new PedidoEntity();

    pedidoEntity.status = StatusPedido.EM_PROCESSAMENTO;
    pedidoEntity.usuario = usuario;

    const itensPedidoEntidade = dadosPedido.itensPedido.map((itemPedido) => {
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );

      if (!produtoRelacionado) {
        throw new NotFoundException(`Produto cujo id é ${itemPedido.produtoId} não existe`);
      }

      const itemPedidoEntity = new ItemPedidoEntity();
      itemPedidoEntity.produto = produtoRelacionado;
      itemPedidoEntity.precoVenda = produtoRelacionado.valor;
      itemPedidoEntity.quantidade = itemPedido.quantidade;
      itemPedidoEntity.produto.quantidadeDisponivel -= itemPedidoEntity.quantidade;

      if (itemPedidoEntity.produto.quantidadeDisponivel < 0) {
        throw new BadRequestException(
          'Quantidade insuficiente do produto cujo id é ' +
            `${itemPedidoEntity.produto.id}: ` +
            `solicitação de ${itemPedido.quantidade}, ` +
            `mas há ${itemPedidoEntity.produto.quantidadeDisponivel + itemPedidoEntity.quantidade} apenas`,
        );
      }

      return itemPedidoEntity;
    });

    const valorTotal = itensPedidoEntidade.reduce((total, item) => {
      return total + item.precoVenda * item.quantidade;
    }, 0);

    pedidoEntity.itensPedido = itensPedidoEntidade;
    pedidoEntity.valorTotal = valorTotal;

    const pedidoCriado = await this.pedidoRepository.save(pedidoEntity);
    return pedidoCriado;
  }

  private async buscaUsuario(usuarioId: string) {
    const possivelUsuario = await this.usuarioRepository.findOneBy({
      id: usuarioId
    });

    if (!possivelUsuario) {
      throw new NotFoundException('Usuário não existe');
    }

    return possivelUsuario;
  }

  async listaPedido(usuarioId: string): Promise<PedidoEntity[]> {
    if (!isUUID(usuarioId)) {
      throw new NotFoundException('Usuário não existe');
    }

    await this.buscaUsuario(usuarioId);

    const pedidos = await this.pedidoRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: {
        usuario: true,
      },
    });

    return pedidos;
  }

  async atualizaPedido(
    id: string,
    novosDados: AtualizaPedidoDTO,
    usuarioId: string
  ) {
    const possivelPedido = await this.pedidoRepository.findOne({
      where: { id: id },
      relations: { usuario: true }
    });

    if (!possivelPedido) {
      throw new NotFoundException('Pedido não existe');
    }

    if (possivelPedido.usuario.id !== usuarioId) {
      throw new UnauthorizedException('Pedido não existe');
    }

    Object.assign(possivelPedido, novosDados);
    await this.pedidoRepository.update(id, possivelPedido);
    return possivelPedido;
  }
}
