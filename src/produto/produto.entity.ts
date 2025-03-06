import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ProdutoCaracteristicaEntity } from "./produto-caracteristica.entity";
import { ProdutoImagemEntity } from "./produto-imagem.entity";
import { UsuarioEntity } from "src/usuario/usuario.entity";
import { FornecedorEntity } from "src/fornecedor/fornecedor.entity";

@Entity({ name: 'produtos' })
export class ProdutoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', length: 100, nullable: false })
  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.id)
  usuarioId: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'valor', nullable: false })
  valor: number;

  @Column({ name: 'quantidade_disponivel', nullable: false })
  quantidadeDisponivel: number;

  @Column({ name: 'descricao', length: 255, nullable: false })
  descricao: string;

  @Column({ name: 'categoria', length: 100, nullable: false })
  categoria: string;

  @OneToMany(() => ProdutoCaracteristicaEntity, (caracteristicas) => caracteristicas.produto,
    { cascade: true, eager: true })
  caracteristicas: ProdutoCaracteristicaEntity[];

  @OneToMany(() => ProdutoImagemEntity, (imagens) => imagens.produto,
    { cascade: true, eager: true })
  imagens: ProdutoImagemEntity[];

  @ManyToOne(() => FornecedorEntity, (fornecedor) => fornecedor.produtos,
    { cascade: false, eager: true, nullable: true })
  fornecedor: FornecedorEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}