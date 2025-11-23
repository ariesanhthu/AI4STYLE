export class OrderDetailEntity {
  constructor(
    public readonly orderDetailId: string,
    public readonly orderId: string,
    public readonly variantId: string,
    public quantity: number,
    public pricePerUnit: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
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
    };
  }
}
