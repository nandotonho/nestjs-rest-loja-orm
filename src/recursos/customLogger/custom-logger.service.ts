import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ProdutoEntity } from '../../modulos/produto/produto.entity';
import { bgMagenta, white } from 'colors';
import { appendFileSync } from 'fs';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  formataLog(nome: string, quantidadeDisponivel: number, valor: number) {
    return `LOCAL: ${
      this.context
    } - NOME: ${nome} - QUANTIDADE: ${quantidadeDisponivel} - PREÇO: ${valor} - TIMESTAMP ${this.getTimestamp()}`;
  }

  logColorido(produto: ProdutoEntity) {
    const { nome, quantidadeDisponivel, valor } = produto;
    const logFormatado = this.formataLog(nome, quantidadeDisponivel, valor);

    console.log(bgMagenta(white(logFormatado)));
  }

  logEmArquivo(produto: ProdutoEntity) {
    const { nome, quantidadeDisponivel, valor } = produto;

    const mensagemFormatada =
      this.formataLog(nome, quantidadeDisponivel, valor) + '\n'; //adicionei a quebra de linha pois o appendFileSync não faz isso automaticamente

    const caminhoDoLog = './src/recursos/customLogger/arquivo.log';

    appendFileSync(caminhoDoLog, mensagemFormatada);
  }
}
