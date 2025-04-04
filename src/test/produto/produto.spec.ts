import * as request from 'supertest';
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { bootstrap } from '../../main';
import { ProdutoEntity } from '../../modulos/produto/produto.entity';

let app: INestApplication;

beforeAll(async () => {
  app = await bootstrap();
  await app.init();
});

afterAll(async () => {
  await app.close();
});

describe('GET em /produtos', () => {
  it('Deve retornar uma lista de produtos', async () => {
    await request(app.getHttpServer()).get('/produtos').expect(200);
  });

  it('Deve retornar um produto', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/produtos/f4b75e4a-1a37-4ab1-ab3f-c88035d41763')
      .expect('content-type', /json/)
      .expect(200);

    expect(resposta.body.produto.nome).toEqual(
      'Figura de ação Marvel Homem de Ferro Olympus Homem de Ferro E6357 de Hasbro Classic',
    );
  });

  it('Deve retornar não encontrado, passando id inexistente', async () => {
    await request(app.getHttpServer()).get('/produtos/FLUMINENSE').expect(404);
  });
});

let idResposta;
describe('POST em /produtos', () => {
  it('Deve adicionar um novo produto', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/produtos')
      .send({
        nome: 'Figura de ação Marvel Viúva Negra Olympus Viúva Negra E8537 de Hasbro Classic',
        valor: 70,
        quantidadeDisponivel: 6,
        descricao: 'Produto novo, bem acabado, alegria para colecionadores',
        caracteristicas: [
          {
            nome: 'Fabricante',
            descricao: 'Iron Studios',
          },
          {
            nome: 'material',
            descricao: 'Plástico',
          },
          {
            nome: 'idade',
            descricao: '5+',
          },
        ],
        imagens: [
          {
            url: 'https://i.imgur.com/dwDZICq.jpg',
            descricao: 'Imagem da Viúva Negra',
          },
        ],
        categoria: 'Colecionáveis',
      })
      .expect(201);

    idResposta = resposta.body.produto.id;
  });
});

describe('PUT em /produtos', () => {
  it('Deve alterar o nome do produto', async () => {
    await request(app.getHttpServer())
      .put(`/produtos/${idResposta}`)
      .send({
        nome: 'Figura de ação Marvel Viúva Negra Olympus Viúva Negra E8538 de Hasbro Classic',
      })
      .expect(200);
  });
});

describe('DELETE em /produtos', () => {
  it('Deve excluir o produto', async () => {
    await request(app.getHttpServer())
      .delete(`/produtos/${idResposta}`)
      .expect(200);
  });
});

describe('Testando o modelo produto', () => {
  const objetoProduto = {
    nome: 'Nome do Produto',
    valor: 15,
    quantidadeDisponivel: 8,
    descricao: 'Descrição do Produto',
    categoria: 'Categoria do Produto',
    caracteristicas: [
      {
        nome: 'Produto Caracteristica 1',
        descricao: 'Descricao Característica 1',
      },
      {
        nome: 'Produto Caracteristica 2',
        descricao: 'Descricao Característica 2',
      },
      {
        nome: 'Produto Caracteristica 3',
        descricao: 'Descricao Característica 3',
      },
    ],
    imagens: [
      {
        url: 'Url Imagem 1',
        descricao: 'Descricao Imagem 1',
      },
    ],
  };

  it('Deve instanciar um novo produto', () => {
    const produtoEntity: ProdutoEntity = new ProdutoEntity();

    Object.assign(produtoEntity, objetoProduto as ProdutoEntity);

    expect(produtoEntity).toEqual(expect.objectContaining(objetoProduto));
  });
});
