export default class Validator {
  static validateProduct(product) {
    const { description, byPrice, sellPrice } = product;

    if (description.length < 3 || description.length > 50) {
      throw new Error('Descrição deve está entre 3 e 50 caracteres');
    } 

    if (byPrice < 0) {
      throw new Error('O valor do preço de venda não deve ser negativo');
    }

    if (sellPrice < 0) {
      throw new Error('O valor do preço da compra não deve ser negativo');
    }

    if (sellPrice > byPrice) {
      throw new Error('Preço de venda não deve ser maior que preço de compra');
    }

    return product;
  }
}
