import { ProductVariantEntity } from "@/core/product/entities";

export class OrderDetailEntity {
  constructor(
    public readonly orderDetailId: string,
    public readonly orderId: string,
    public readonly variantId: string,
    public quantity: number,
    public pricePerUnit: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public variant?: ProductVariantEntity,
  ) {}

  toJSON() {
    return {
      orderDetailId: this.orderDetailId,
      orderId: this.orderId,
      variantId: this.variantId,
      quantity: this.quantity,
      pricePerUnit: this.pricePerUnit,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      variant: this.variant?.toJSON() || null,
    };
  }
}
