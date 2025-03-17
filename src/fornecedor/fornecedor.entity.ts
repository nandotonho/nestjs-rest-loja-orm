import { ProdutoEntity } from 'src/produto/produto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fornecedores' })
export class FornecedorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'cnpj', length: 11, nullable: false })
  cnpj: string;

  @OneToMany(() => ProdutoEntity, (produto) => produto.fornecedor)
  produtos: ProdutoEntity[];
}