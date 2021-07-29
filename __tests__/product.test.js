//A quantidade vendida pode ser de 1 ou mais unidades.

import Product from "../src/model/product";
import sellProduct from "../src/service/sellProduct";

test("Deve validar baixa de estoque de venda uma unidade", () => {
  let product = new Product("Monitor", 500.0, 900.0, 10);
  sellProduct(product, 1);
  expect(product.stock).toBe(9);
},);

test('Deve aceitar a venda de mais do que uma unidade', () => {
  let product = new Product("Monitor", 500.0, 900.0, 10);
  sellProduct(product, 3);
  expect(product.stock).toBe(7);
});
