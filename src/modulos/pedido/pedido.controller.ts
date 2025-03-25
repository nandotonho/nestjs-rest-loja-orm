import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CriaPedidoDTO } from './dto/CriaPedido.dto';
import { AtualizaPedidoDTO } from './dto/AtualizaPedido.dto';
import {
  AutenticacaoGuard,
  RequisicaoComUsuario
} from '../autenticacao/autenticacao.guard';
import { PedidoEntity } from './pedido.entity';

@UseGuards(AutenticacaoGuard)
@Controller('/pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async criaPedido(
    @Req() req: RequisicaoComUsuario,
    @Body() dadosPedido: CriaPedidoDTO,
  ) {
    const usuarioId = req.usuario.sub;
    const pedidoCriado = await this.pedidoService.cadastraPedido(
      usuarioId,
      dadosPedido,
    );

    return pedidoCriado;
  }

  @Get()
  async listaPedido(@Req() req: RequisicaoComUsuario) {
    const usuarioId = req.usuario.sub;
    const pedidos = await this.pedidoService.listaPedido(usuarioId);

    return pedidos;
  }

  @Patch(':id')
  async atualizaPedido(
    @Req() req: RequisicaoComUsuario,
    @Param('id') id: string,
    @Body() novosDados: AtualizaPedidoDTO
  ) {
    const usuarioId = req.usuario.sub;
    const pedidoAtualizado = await this.pedidoService.atualizaPedido(id, novosDados, usuarioId);

    return pedidoAtualizado;
  }
}
