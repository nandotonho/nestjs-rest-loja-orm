import { Module } from '@nestjs/common';
import { ProdutoController } from './produto.controller';
import { ProdutoRepository } from './produto.repository';
import { ProdutoService } from './produto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoEntity } from './produto.entity';
import { CustomLogger } from 'src/recursos/customLogger/custom-logger.service';
import { CustomLoggerModule } from 'src/recursos/customLogger/custom-logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutoEntity]), CustomLoggerModule],
  controllers: [ProdutoController],
  providers: [ProdutoService, ProdutoRepository],
})
export class ProdutoModule {}
