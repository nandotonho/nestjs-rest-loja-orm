import { IsNotEmpty, IsOptional } from 'class-validator';
import { ProdutoEntity } from '../produto.entity';

export class ImagemProdutoDTO {
  @IsOptional()
  id: string;

  @IsNotEmpty({ message: 'A URL da imagem não pode ser vazia' })
  url: string;

  @IsNotEmpty({ message: 'A descrição da imagem não pode ser vazia' })
  descricao: string;

  @IsOptional()
  produto: ProdutoEntity;
}
