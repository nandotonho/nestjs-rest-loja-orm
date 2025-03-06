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
import { v4 as uuid } from "uuid";
import { ProdutoEntity } from './produto.entity';

@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  public async criaProduto(@Body() dadosDoProduto: CriaProdutoDTO) {
    const produtoEntity = new ProdutoEntity();
    produtoEntity.usuarioId = dadosDoProduto.usuarioId;
    produtoEntity.nome = dadosDoProduto.nome;
    produtoEntity.valor = dadosDoProduto.valor;
    produtoEntity.quantidadeDisponivel = dadosDoProduto.quantidadeDisponivel;
    produtoEntity.descricao = dadosDoProduto.descricao;
    produtoEntity.caracteristicas = dadosDoProduto.caracteristicas;
    produtoEntity.imagens = dadosDoProduto.imagens;
    produtoEntity.categoria = dadosDoProduto.categoria;
    produtoEntity.id = uuid();

    await this.produtoService.criaProduto(produtoEntity);

    return {
      produto: produtoEntity,
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
