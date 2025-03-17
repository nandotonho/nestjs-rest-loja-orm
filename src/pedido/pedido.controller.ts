import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CriaPedidoDTO } from './dto/CriaPedido.dto';
import { AtualizaPedidoDTO } from './dto/AtualizaPedido.dto';

@Controller('/pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async criaPedido(
    @Query('usuarioId') usuarioId: string,
    @Body() dadosPedido: CriaPedidoDTO,
  ) {
    const pedidoCriado = await this.pedidoService.cadastraPedido(
      usuarioId,
      dadosPedido,
    );

    return pedidoCriado;
  }

  @Get()
  async listaPedido(@Query('usuarioId') usuarioId: string) {
    const pedidos = await this.pedidoService.listaPedido(usuarioId);

    return pedidos;
  }

  @Patch(':id')
  async atualizaPedido(@Param('id') id: string, @Body() novosDados: AtualizaPedidoDTO) {
    const pedidoAtualizado = await this.pedidoService.atualizaPedido(id, novosDados);

    return pedidoAtualizado;
  }
}
