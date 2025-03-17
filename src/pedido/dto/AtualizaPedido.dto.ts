import { PartialType } from '@nestjs/mapped-types';
import { CriaPedidoDTO } from './CriaPedido.dto';
import { IsEnum } from 'class-validator';
import { StatusPedido } from '../enum/statuspedido.enum';
import { Type } from 'class-transformer';

export class AtualizaPedidoDTO extends PartialType(CriaPedidoDTO) {
  @IsEnum(StatusPedido)
  status: StatusPedido;
}
