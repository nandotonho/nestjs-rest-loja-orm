import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CaracteristicaProdutoDTO } from './CaracteristicaProduto.dto';
import { ImagemProdutoDTO } from './ImagemProduto.dto';
import { Type } from 'class-transformer';

export class CriaProdutoDTO {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor precisa ser numérico com até 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor precisa ser positivo' })
  valor: number;

  @IsPositive({ message: 'A quantidade precisa ser positiva' })
  quantidadeDisponivel: number;

  @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
  @MaxLength(1000, { message: 'A descrição pode ter até 1000 carateres' })
  descricao: string;

  @ValidateNested()
  @IsArray()
  @Type(() => CaracteristicaProdutoDTO)
  @ArrayMinSize(3, { message: 'Devem existir 3 características pelo menos' })
  caracteristicas: CaracteristicaProdutoDTO[];

  @ValidateNested()
  @IsArray()
  @Type(() => ImagemProdutoDTO)
  @ArrayMinSize(1, { message: 'Deve existir 1 imagem pelo menos' })
  imagens: ImagemProdutoDTO[];

  @IsNotEmpty({ message: 'A categoria não pode ser vazia' })
  categoria: string;
}
