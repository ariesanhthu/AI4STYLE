import { EPaymentMethod } from '@/core/payment-method/enums';
import { EPaymentStatus } from '../enums';
import { PaymentTransactionEntity } from './payment-transaction.entity';

export class PaymentAttemptEntity {
  constructor(
    public readonly paymentAttemptId: string,
    public readonly paymentId: string,
    public paymentMethodId: string,
    public type: EPaymentMethod,
    public orderNumber: number,
    public status: EPaymentStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public transactions?: PaymentTransactionEntity[],
  ) {}

  /**
   * Check if this attempt can be retried (status is PENDING)
   */
  canBeRetried(): boolean {
    return this.status === EPaymentStatus.PENDING;
  }

  /**
   * Check if this attempt is in a final state
   */
  isFinalState(): boolean {
    return [
      EPaymentStatus.CAPTURED,
      EPaymentStatus.REFUNDED,
      EPaymentStatus.CANCELED,
    ].includes(this.status);
  }

  /**
   * Cancel this attempt (change PENDING to CANCELED)
   */
  cancel(): void {
    if (this.status === EPaymentStatus.PENDING) {
      this.status = EPaymentStatus.CANCELED;
      this.updatedAt = new Date();
    }
  }

  toJSON() {
    return {
      paymentAttemptId: this.paymentAttemptId,
      paymentId: this.paymentId,
      paymentMethodId: this.paymentMethodId,
      type: this.type,
      orderNumber: this.orderNumber,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      transactions: this.transactions?.map((transaction) =>
        transaction.toJSON(),
      ),
    };
  }
}
