import { ETransactionType } from '../enums';

export class PaymentTransactionEntity {
  constructor(
    public readonly transactionId: string,
    public readonly paymentId: string,
    public requestBody: string,
    public responseBody: string,
    public type: ETransactionType,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  toJSON() {
    return {
      transactionId: this.transactionId,
      paymentId: this.paymentId,
      requestBody: JSON.parse(this.requestBody),
      responseBody: JSON.parse(this.responseBody),
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
