import { Injectable, NotFoundException } from '@nestjs/common';
import { ProdutoEntity } from './produto.entity';
import { AtualizaProdutoDTO } from './dto/AtualizaProduto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ProdutoRepository } from './produto.repository';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private readonly produtoRepository: Repository<ProdutoEntity>,
    private readonly produtoCustomRepository: ProdutoRepository
  ) {}

  public async criaProduto(produtoEntity: ProdutoEntity) {
    await this.produtoRepository.save(produtoEntity);
  }

  public async listaProduto() {
    return await this.produtoRepository.find();
  }

  private async buscaPorId(id: string) {
    if (!isUUID(id)) {
      throw new NotFoundException('Usuário não existe');
    }

    const possivelProduto = await this.produtoRepository.findOne({
      where: { id }
    });

    if (!possivelProduto) {
      throw new NotFoundException('Produto não existe');
    }

    return possivelProduto;
  }

  public async atualizaProduto(id: string, novosDados: AtualizaProdutoDTO) {
    await this.buscaPorId(id);
    return await this.produtoRepository.update(id, novosDados);
  }

  public async removeProduto(id: string) {
    await this.buscaPorId(id);
    return await this.produtoRepository.delete(id);
  }

  public async findByCategoria(categoria: string): Promise<ProdutoEntity[]> {
    return this.produtoCustomRepository.findByCategoria(categoria);
  }
}