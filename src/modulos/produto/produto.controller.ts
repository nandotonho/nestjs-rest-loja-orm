import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseInterceptors
} from '@nestjs/common';
import { CriaProdutoDTO } from './dto/CriaProduto.dto';
import { AtualizaProdutoDTO } from './dto/AtualizaProduto.dto';
import { ProdutoService } from './produto.service';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProdutoEntity } from './produto.entity';

@Controller('/produtos')
export class ProdutoController {
  constructor(
    private readonly produtoService: ProdutoService,
    @Inject(CACHE_MANAGER) private gerenciadorDeCache: Cache
  ) {}

  @Post()
  public async criaProduto(@Body() dadosDoProduto: CriaProdutoDTO) {
    const produtoCriado = await this.produtoService.criaProduto(dadosDoProduto);

    return {
      produto: produtoCriado,
      mensagem: 'produto criado com sucesso'
    };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  public async listaProduto() {
    return await this.produtoService.listaProduto();
  }

  @Get('/:id')
  public async listaUmProduto(@Param('id') id: string) {
    let produto = await this.gerenciadorDeCache.get<ProdutoEntity>(`produto-${id}`);

    if (!produto) {
      produto = await this.produtoService.buscaPorId(id);

      await this.gerenciadorDeCache.set(`produto-${id}`, produto);
    }

    return {
      produto: produto,
      mensagem: 'produto encontrado'
    };
  }

  @Put('/:id')
  public async atualizaProduto(@Param('id') id: string, @Body() novosDados: AtualizaProdutoDTO) {
    const produtoAtualizado = await this.produtoService.atualizaProduto(id, novosDados);

    return {
      produto: produtoAtualizado,
      mensagem: 'produto atualizado com sucesso'
    };
  }

  @Delete('/:id')
  public async removeProduto(@Param('id') id: string) {
    const produtoRemovido = await this.produtoService.removeProduto(id);

    return {
      produto: produtoRemovido,
      mensagem: 'produto removido com sucesso'
    };
  }
}
