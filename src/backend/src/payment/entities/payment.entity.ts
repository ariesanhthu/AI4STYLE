import { EPaymentMethod } from '../../payment-method/enums';
import { EPaymentStatus } from '../enums';
import { PaymentTransactionEntity } from './payment-transaction.entity';

export class PaymentEntity {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public paymentMethodId: string,
    public amount: number,
    public type: EPaymentMethod,
    public status: EPaymentStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public transactions?: PaymentTransactionEntity[],
  ) {}

  toJSON() {
    return {
      paymentId: this.paymentId,
      orderId: this.orderId,
      paymentMethodId: this.paymentMethodId,
      amount: this.amount,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      transactions: this.transactions?.map((transaction) => transaction.toJSON()),
    };
  }
}