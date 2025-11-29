export class ProductVariantEntity {
  constructor(
    public readonly variantId: string,
    public optionId: string,
    public sku: string,
    public size: string,
    public price: number,
    public newPrice: number | null,
    public stockQuantity: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Get the display price (new_price if available, otherwise original price)
   */
  getDisplayPrice(): number {
    return this.newPrice ?? this.price;
  }

  /**
   * Check if this variant has a discount
   */
  hasDiscount(): boolean {
    return this.newPrice !== null && this.newPrice < this.price;
  }

  /**
   * Calculate discount percentage
   */
  getDiscountPercentage(): number | null {
    if (!this.hasDiscount()) {
      return null;
    }
    return Math.round(((this.price - this.newPrice!) / this.price) * 100);
  }

  /**
   * Check if this variant is in stock
   */
  isInStock(): boolean {
    return this.stockQuantity > 0;
  }

  /**
   * Check if this variant is low in stock (less than 10 items)
   */
  isLowStock(threshold: number = 10): boolean {
    return this.stockQuantity > 0 && this.stockQuantity < threshold;
  }

  toJSON() {
    return {
      variantId: this.variantId,
      optionId: this.optionId,
      sku: this.sku,
      size: this.size,
      price: this.price,
      newPrice: this.newPrice,
      // displayPrice: this.getDisplayPrice(),
      stockQuantity: this.stockQuantity,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      hasDiscount: this.hasDiscount(),
      discountPercentage: this.getDiscountPercentage(),
      inStock: this.isInStock(),
      lowStock: this.isLowStock(),
    };
  }
}
