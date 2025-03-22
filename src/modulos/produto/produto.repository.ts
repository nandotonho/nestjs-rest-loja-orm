import { Injectable } from '@nestjs/common';
import { ProdutoEntity } from './produto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProdutoRepository {
  constructor(
    @InjectRepository(ProdutoEntity)
    private readonly produtoRepository: Repository<ProdutoEntity>
  ) {}

  public async findByCategoria(categoria: string): Promise<ProdutoEntity[]> {
    return await this.produtoRepository.find({ where: { categoria: categoria } });
  }
}
