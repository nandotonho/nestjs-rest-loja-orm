import * as request from 'supertest';
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { bootstrap } from '../../main';

let app: INestApplication;

beforeAll(async () => {
  app = await bootstrap();
  await app.init();
});

afterAll(async () => {
  await app.close();
});

describe('GET em /usuarios', () => {
  it('Deve retornar uma lista de usuarios', async () => {
    await request(app.getHttpServer()).get('/usuarios').expect(200);
  });
});

describe('POST em /usuarios', () => {
  it.skip('Deve adicionar um novo usuário', async () => {
    await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Beltrano',
        email: 'beltrano@mail.com',
        senha: 'Beltrano-01',
      })
      .expect(201);
  });

  it('Deve retornar conflito ao tentar adicionar um novo usuário com email já existente', async () => {
    await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Beltrano',
        email: 'beltrano@mail.com',
        senha: 'Beltrano-01',
      })
      .expect(409);
  });
});
