import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  Module
} from '@nestjs/common';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { ProdutoModule } from './modulos/produto/produto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { PedidoModule } from './modulos/pedido/pedido.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { FiltroDeExcecaoGlobal } from './recursos/filtros/filtro-de-excecao-global';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AutenticacaoModule } from './modulos/autenticacao/autenticacao.module';
import { LoggerGlobalInterceptor } from './recursos/interceptores/logger-global.interceptor';

@Module({
  imports: [
    UsuarioModule,
    ProdutoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    PedidoModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({ ttl: 60 * 1000 }) // Tempo de expiração do cache (1m aqui)
      }),
      isGlobal: true // Para ter acesso ao CacheModule em toda a aplicação
    }),
    AutenticacaoModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: FiltroDeExcecaoGlobal
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerGlobalInterceptor
    },
    ConsoleLogger
  ]
})
export class AppModule {}
