import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CaracteristicaProdutoDTO } from './CaracteristicaProduto.dto';
import { ImagemProdutoDTO } from './ImagemProduto.dto';
import { Type } from 'class-transformer';

export class AtualizaProdutoDTO {
  @IsUUID(undefined, { message: 'ID de usuário inválido' })
  usuarioId: string;

  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @IsOptional()
  nome: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor precisa ser numérico com até 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor precisa ser positivo' })
  @IsOptional()
  valor: number;

  @IsPositive({ message: 'A quantidade precisa ser positiva' })
  @IsOptional()
  quantidadeDisponivel: number;

  @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
  @MaxLength(1000, { message: 'A descrição pode ter até 1000 carateres' })
  @IsOptional()
  descricao: string;

  @ValidateNested()
  @IsArray()
  @Type(() => CaracteristicaProdutoDTO)
  @ArrayMinSize(3, { message: 'Devem existir 3 características pelo menos' })
  @IsOptional()
  caracteristicas: CaracteristicaProdutoDTO[];

  @ValidateNested()
  @IsArray()
  @Type(() => ImagemProdutoDTO)
  @ArrayMinSize(1, { message: 'Deve existir 1 imagem pelo menos' })
  @IsOptional()
  imagens: ImagemProdutoDTO[];

  @IsNotEmpty({ message: 'A categoria não pode ser vazia' })
  @IsOptional()
  categoria: string;

  @Type(() => Date)
  @IsDate({ message: 'A criação deve ser uma data' })
  @IsOptional()
  dataCriacao: Date;

  @Type(() => Date)
  @IsDate({ message: 'A atualização deve ser uma data' })
  @IsOptional()
  dataAtualizacao: Date;
}
