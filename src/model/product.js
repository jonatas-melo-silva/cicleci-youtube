import { uuid } from 'uuidv4';

export default class Product {
  constructor(
    code ,
    description,
    byPrice,
    sellPrice,
    tags,
    lovers = 0,
    id = uuid()
  ) {
    this.code = code;
    this.description = description;
    this.byPrice = byPrice;
    this.sellPrice = sellPrice;
    this.tags = tags;
    this.lovers = lovers;
    this.id = id;
  }
}
