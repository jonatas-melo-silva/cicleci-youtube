import express from 'express';
import cors from 'cors';
import Product from '../src/model/product';
// import { uuid } from 'uuidv4';

const app = express();

app.use(express.json());
app.use(cors());

let products = [];

app.get('/products', (request, response) => {
  //listagem de produtos
  response.status(200).json(products);
});

app.post('/products', (request, response) => {
  //cadastro de produtos
  const { code, description, byPrice, sellPrice, tags, id } = request.body;

  const p = products.find(product => product.code == code); //product.code:Number - code:String
  const love = p ? p.lovers : 0;
  const product = new Product(
    code,
    description,
    byPrice,
    sellPrice,
    tags,
    love,
    id
  );
  products.push(product);
  response.status(201).json(product);
});

app.put('/products/:id', (request, response) => {
  //atualização de produtos
  const { id } = request.params;

  const { description, byPrice, sellPrice, tags } = request.body;

  const p = products.find(product => product.id === id); //product.id:String - id:String

  if (p) {
    p.description = description;
    p.byPrice = byPrice;
    p.sellPrice = sellPrice;
    p.tags = tags;
    response.status(200).json(p);
  } else {
    response.status(400).json({ message: 'Produto não encontrado' });
  }
});

app.delete('/products/:code', (request, response) => {
  //exclusão de produtos
  const { code } = request.params;

  const index = products.findIndex(product => product.code == code); //product.code:Number - code:String

  if (index === -1) {
    response.status(400).json({ message: 'Produto não encontrado' });
  } else {
    products = products.filter(product => product.code != code); //product.code:Number - code:String
    response.status(204).json({ message: 'Produto excluído' });
  }
});

app.post('/products/:code/love', (request, response) => {
  //incremento de "love" por code
  const { code } = request.params;

  const product = products.find(product => product.code == code); //product.code:Number - code:String

  if (!product) {
    response.status(400).json({ message: 'Produto não encontrado' });
  } else {
    products
      .filter(product => product.code == code)
      .map(product => {
        product.lovers += 1;
      });
    response.status(201).json({
      lovers: product.lovers
    });
  }
});

app.get('/products/:code', (request, response) => {
  //consulta de produtos por code
  // const { code } = request.params;

  // const index = products.findIndex(product => product.code == code);

  // if (index === -1) {
  //   response.status(400).json({ message: 'Produto não encontrado' });
  // } else {
  //   const product = products.filter(product => product.code == code);
  //   response.status(200).json(product);
  // }

});

export default app;
