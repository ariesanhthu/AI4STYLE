import { ProductOptionEntity } from './product-option.entity';

export class ProductEntity {
  constructor(
    public readonly productId: string,
    public categoryId: string,
    public name: string,
    public description: string | null,
    public thumbnail: string | null,
    public search: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public options?: ProductOptionEntity[],
  ) {}

  toJSON() {
    return {
      productId: this.productId,
      categoryId: this.categoryId,
      name: this.name,
      description: this.description,
      thumbnail: this.thumbnail,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      options: this.options?.map((option) => option.toJSON()),
    };
  }
}
