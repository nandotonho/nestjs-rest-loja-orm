import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RequisicaoComUsuario } from '../../modulos/autenticacao/autenticacao.guard';
import { Request, Response } from 'express';

@Injectable()
export class LoggerGlobalInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}

  intercept(contexto: ExecutionContext, next: CallHandler): Observable<any> {
    const contextoHttp = contexto.switchToHttp();

    const requisicao = contextoHttp.getRequest<
      Request | RequisicaoComUsuario
    >();
    const resposta = contextoHttp.getResponse<Response>();

    if ('path' in requisicao && 'method' in requisicao) {
      const { path, method } = requisicao;
      this.logger.log(`${method} ${path}`);
    }
    const { statusCode } = resposta;
    const instantePreControlador = Date.now();

    return next.handle().pipe(
      tap(() => {
        if ('usuario' in requisicao) {
          this.logger.log(
            `Rota aceessada pelo usuário ${requisicao.usuario.sub}`
          );
        }
        const tempoDeExecucaoDaRota = Date.now() - instantePreControlador;
        this.logger.log(
          `Resposta: status ${statusCode} - ${tempoDeExecucaoDaRota}ms`
        );
      })
    );
  }
}
