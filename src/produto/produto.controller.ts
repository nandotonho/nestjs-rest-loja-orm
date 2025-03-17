import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CriaProdutoDTO } from './dto/CriaProduto.dto';
import { AtualizaProdutoDTO } from './dto/AtualizaProduto.dto';
import { ProdutoService } from './produto.service';

@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  public async criaProduto(@Body() dadosDoProduto: CriaProdutoDTO) {
    const produtoCriado = await this.produtoService.criaProduto(dadosDoProduto);

    return {
      produto: produtoCriado,
      mensagem: 'produto criado com sucesso'
    };
  }

  @Get()
  public async listaProduto() {
    return await this.produtoService.listaProduto();
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
