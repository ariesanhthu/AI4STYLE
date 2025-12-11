import { ProductVariantEntity } from './product-variant.entity';

export class ProductOptionEntity {
  constructor(
    public readonly optionId: string,
    public productId: string,
    public name: string,
    public slug: string,
    public color: string,
    public colorFamily: string,
    public images: string[],
    public price: number,
    public newPrice: number,
    public outOfStock: boolean,
    public isShow: boolean,
    public search: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public variants?: ProductVariantEntity[],
  ) {}

  /**
   * Get the display price (always new_price as it's the effective price)
   */
  getDisplayPrice(): number {
    return this.newPrice;
  }

  /**
   * Check if this option has a discount
   */
  hasDiscount(): boolean {
    return this.newPrice < this.price;
  }

  /**
   * Calculate discount percentage
   */
  getDiscountPercentage(): number | null {
    if (!this.hasDiscount()) {
      return null;
    }
    return Math.round(((this.price - this.newPrice) / this.price) * 100);
  }

  /**
   * Get thumbnail (first image in images array)
   */
  getThumbnail(): string | null {
    return this.images && this.images.length > 0 ? this.images[0] : null;
  }

  toJSON() {
    return {
      optionId: this.optionId,
      productId: this.productId,
      name: this.name,
      slug: this.slug,
      color: this.color,
      colorFamily: this.colorFamily,
      thumbnail: this.getThumbnail(),
      images: this.images,
      price: this.price,
      newPrice: this.newPrice === this.price ? null : this.newPrice,
      // displayPrice: this.getDisplayPrice(),
      outOfStock: this.outOfStock,
      isShow: this.isShow,
      search: this.search,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      hasDiscount: this.hasDiscount(),
      discountPercentage: this.getDiscountPercentage(),
      variants: this.variants?.map((variant) => variant.toJSON()),
    };
  }
}
