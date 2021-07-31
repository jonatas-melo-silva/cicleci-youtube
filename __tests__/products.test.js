import request from 'supertest';
import app from '../src/app';
import Product from '../src/model/product';
import Validator from '../src/util/validator';

let products;

beforeEach(() => {
  products = [
    new Product(12, 'Macbook pro retina 2020', 40.0, 80.0, [
      'tecnologia',
      'Apple',
      'Computador'
    ]),
    new Product(90, 'Positivo pro retina 2020', 10.0, 20.0, [
      'tecnologia',
      'Positivo',
      'Computador'
    ])
  ];
});

test('Deve ser possível adicionar um novo produto', async () => {
  const response = await request(app).post('/products').send(products[0]);

  expect(response.body).toMatchObject({
    ...products[0],
    lovers: 0
  });
});

test('Deve retornar status code 201 quando criar um produto', async () => {
  const response = await request(app).post('/products').send(products[0]);

  expect(response.status).toBe(201);
});

test('Deve ser possível atualizar dados de um produto', async () => {
  const response = await request(app).post('/products').send(products[0]);

  const updateProduct = {
    ...response.body,
    description: 'Dell Pro'
  };

  const responseUpdate = await request(app)
    .put(`/products/${response.body.id}`)
    .send(updateProduct);

  expect(responseUpdate.body).toMatchObject(updateProduct);
});

test('Deve retornar um código 400 ao tentar atualizar um produto inexistente', async () => {
  await request(app).put(`/products/656565`).expect(400);
});

test('Deve retornar status code 200 quando tentar atualizar dados de um produto', async () => {
  const response = await request(app).post('/products').send(products[0]);

  const updateProduct = {
    ...response.body,
    description: 'Acer Core I3'
  };

  await request(app)
    .put(`/products/${response.body.id}`)
    .send(updateProduct)
    .expect(200);
});

test('Deve retornar status code 400 quando tentar deletar um produto inexistente', async () => {
  await request(app).delete(`/products/656565`).expect(400);
});

test('Deve retornar um status code 204 quando um produto for removido', async () => {
  const response = await request(app).post('/products').send(products[0]);

  await request(app).delete(`/products/${response.body.code}`).expect(204);
});

test('Deve ser possível listar todos os produtos', async () => {
  await request(app).post('/products').send(products[0]);

  const responseGet = await request(app).get('/products');

  expect(responseGet.body).toHaveLength(1);
});

test('Deve ser possível remover os produtos pelo código', async () => {
  const response = await request(app).post('/products').send(products[0]);
  await request(app).post('/products').send(products[0]);
  await request(app).post('/products').send(products[1]);

  await request(app).delete(`/products/${response.body.code}`);

  const responseAll = await request(app).get('/products');

  expect(responseAll.body).toHaveLength(1);
});

test('Deve ser possível dar love em um produto', async () => {
  const response = await request(app).post('/products').send(products[0]);

  const responseLove = await request(app)
    .post(`/products/${response.body.code}/love`)
    .send(response.body);

  expect(responseLove.body).toMatchObject({
    lovers: 1
  });
});

// test('Dever ser possível buscar produtos por código do array', async () => {
//   await request(app)
//     .post('/products')
//     .send({
//       ...products[0],
//       code: 40
//     });

//   await request(app)
//     .post('/products')
//     .send({
//       ...products[0],
//       code: 40
//     });

//     const responseGet = await request(app)
//       .get('/products/40');
//     expect(responseGet.body).toHaveLength(2);
// });

// test('Deve retornar o status code 400 ao tentar buscar um produto não cadastrado', async () => {
//   await request(app).get('/products/40')
//   .expect(400);
// });

test('Deve retornar erro ao tentar adicionar uma descrição com 2 caracteres', () => {
  expect(() => {
    Validator.validateProduct(
      new Product(12, 'DC', 50.0, 40.0, ['tech', 'git', 'node'])
    );
  }).toThrow(new Error('Descrição deve está entre 3 e 50 caracteres'));
});

test('Deve aceitar descrição com 3 caracteres', () => {
  const product = Validator.validateProduct(
    new Product(12, 'ABC', 50.0, 40.0, ['tech', 'git', 'node'])
  );
  expect(product.description).toBe('ABC');
});

test('Deve aceitar descrição com 50 caracteres', () => {
  const product = Validator.validateProduct(
    new Product(
      12,
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      50.0,
      40.0,
      ['tech', 'git', 'node']
    )
  );
  expect(product.description).toBe(
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  );
});

test('Deve retornar erro ao tentar adicionar uma descrição com 51 caracteres', () => {
  expect(() => {
    Validator.validateProduct(
      new Product(
        12,
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        50.0,
        40.0,
        ['tech', 'git', 'node']
      )
    );
  }).toThrow(new Error('Descrição deve está entre 3 e 50 caracteres'));
});

//byPrice > sellPrice primeiro a ser negado
// byPrice <= sellPrice se a ser aceito

//byPrice deve ser menor que sellPrice
test('Deve retornar erro ao tentar adicionar sellPrice > byPrice  ', () => {
  expect(() => {
    Validator.validateProduct(
      new Product(12, 'asd', 50.0, 60.0, ['tech', 'git', 'node'])
    );
  }).toThrow(
    new Error('Preço de venda não deve ser maior que preço de compra')
  );
});

test('Deve aceitar adicionar byPrice == sellPrice', () => {
  const product = Validator.validateProduct(
    new Product(12, 'asd', 50.0, 50.0, ['tech', 'git', 'node'])
  );
  expect(product.byPrice).toBe(product.sellPrice);
});

test('Deve retornar erro ao tentar adicionar byPrice negativo', () => {
  expect(() => {
    Validator.validateProduct(
      new Product(12, 'asd', -50.0, 40.0, ['tech', 'git', 'node'])
    );
  }).toThrow(new Error('O valor do preço de venda não deve ser negativo'));
});

test('Deve aceitar adicionar byPrice positivo', () => {
  const product = Validator.validateProduct(
    new Product(12, 'asd', 50.0, 40.0, ['tech', 'git', 'node'])
  );
  expect(product.byPrice).toBe(50.0);
});

test('Deve retornar erro ao tentar adicionar sellPrice negativo', () => {
  expect(() => {
    Validator.validateProduct(
      new Product(12, 'asd', 50.0, -40.0, ['tech', 'git', 'node'])
    );
  }).toThrow(new Error('O valor do preço da compra não deve ser negativo'));
});

test('Deve aceitar adicionar sellPrice positivo', () => {
  const product = Validator.validateProduct(
    new Product(12, 'asd', 50.0, 40.0, ['tech', 'git', 'node'])
  );
  expect(product.sellPrice).toBe(40.0);
});
