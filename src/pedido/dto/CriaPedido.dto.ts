import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  IsUUID,
  ValidateNested
} from 'class-validator';

export class ItemPedidoDTO {
  @IsUUID()
  produtoId: string;

  @IsInt({ message: 'A quantidade precisa ser inteira' })
  @IsPositive({ message: 'A quantidade precisa ser positiva' })
  quantidade: number;
}

export class CriaPedidoDTO {
  @ValidateNested()
  @IsArray()
  @Type(() => ItemPedidoDTO)
  @ArrayMinSize(1, { message: 'Deve haver pelo menos um item no pedido' })
  itensPedido: ItemPedidoDTO[];
}
