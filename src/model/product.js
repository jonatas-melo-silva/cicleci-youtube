export default class Product {
  constructor(description='', byPrice=0, sellPrice=0, stock=0){
    this.description = description;
    this.byPrice = byPrice;
    this.sellPrice = sellPrice;
    this.stock = stock;
  }
}