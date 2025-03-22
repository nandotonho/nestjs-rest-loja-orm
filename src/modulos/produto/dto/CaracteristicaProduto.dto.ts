import { IsNotEmpty, IsOptional } from 'class-validator';
import { ProdutoEntity } from '../produto.entity';

export class CaracteristicaProdutoDTO {
  @IsOptional()
  id: string;

  @IsNotEmpty({ message: 'O nome da característica não pode ser vazio' })
  nome: string;

  @IsNotEmpty({ message: 'A descrição da característica não pode ser vazia' })
  descricao: string;

  @IsOptional()
  produto: ProdutoEntity;
}
