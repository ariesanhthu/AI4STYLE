import { EOrderStatus } from '../enums';
import { OrderDetailEntity } from './order-detail.entity';

export class OrderEntity {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly orderCode: string,
    public totalPrice: number,
    public status: EOrderStatus,
    public recipientName: string,
    public phoneNumber: string,
    public shippingAddress: string,
    public email: string | null,
    public search: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public orderDetails?: OrderDetailEntity[],
  ) {}

  toJSON() {
    return {
      orderId: this.orderId,
      userId: this.userId,
      orderCode: this.orderCode,
      totalPrice: this.totalPrice,
      status: this.status,
      recipientName: this.recipientName,
      phoneNumber: this.phoneNumber,
      shippingAddress: this.shippingAddress,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      orderDetails: this.orderDetails?.map((detail) => detail.toJSON()),
    };
  }
}
