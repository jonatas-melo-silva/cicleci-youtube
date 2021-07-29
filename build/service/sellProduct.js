"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/**
 * A quantidade vendida pode ser de 1 ou mais unidades.
 * -> Se estoque ficar negativo uma exception deve ser lançada.
 * -> O valor de venda não pode ser maior do que o valor de compra.
 *
 * @param {*} product
 * @param {*} quantity
 */

var _product = require('../model/product'); var _product2 = _interopRequireDefault(_product);

 function sellProduct(product=_product2.default, amount=0) {
  product.stock -= 1;
  return product;
} exports.default = sellProduct;
