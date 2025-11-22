import { EPaymentMethod } from '../../payment-method/enums';
import { EPaymentStatus, ETransactionType } from '../enums';
import { PaymentAttemptEntity } from './payment-attempt.entity';

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
    public attempts?: PaymentAttemptEntity[],
  ) {}

  /**
   * Get the latest payment attempt
   */
  getLatestAttempt(): PaymentAttemptEntity | undefined {
    if (!this.attempts || this.attempts.length === 0) {
      return undefined;
    }
    return this.attempts.reduce((latest, current) =>
      current.orderNumber > latest.orderNumber ? current : latest,
    );
  }

  /**
   * Check if payment can accept a new attempt
   * Only PENDING payments can have new attempts
   */
  canCreateNewAttempt(): boolean {
    return this.status === EPaymentStatus.PENDING;
  }

  /**
   * Update payment status based on the latest attempt status
   */
  syncStatusFromLatestAttempt(): void {
    const latestAttempt = this.getLatestAttempt();
    if (latestAttempt) {
      // If attempt is FAILED, payment goes back to PENDING
      if (latestAttempt.status === EPaymentStatus.FAILED) {
        this.status = EPaymentStatus.PENDING;
      } else {
        // Otherwise, payment status matches attempt status
        this.status = latestAttempt.status;
      }
      this.updatedAt = new Date();
    }
  }

  /**
   * Cancel the last pending attempt if exists
   */
  cancelLastPendingAttempt(): void {
    const latestAttempt = this.getLatestAttempt();
    if (latestAttempt?.canBeRetried()) {
      latestAttempt.cancel();
    }
  }

  /**
   * Get the next order number for a new attempt
   */
  getNextAttemptOrderNumber(): number {
    if (!this.attempts || this.attempts.length === 0) {
      return 1;
    }
    const maxOrder = Math.max(...this.attempts.map((a) => a.orderNumber));
    return maxOrder + 1;
  }

  getAttemptById(attemptId: string): PaymentAttemptEntity | undefined {
    return this.attempts?.find(
      (attempt) => attempt.paymentAttemptId === attemptId,
    );
  }

  getValueInTransactionPayload(key: string, type: ETransactionType): string | undefined {
    // can i traverse reversely?
    for (const attempt of this.attempts || []) {
      for (const transaction of attempt.transactions || []) {
        if (transaction.type === type) {
          try {
            const jsonRequest = JSON.parse(transaction.requestBody);
            const jsonResponse = JSON.parse(transaction.responseBody);
            if (key in jsonRequest) {
              return jsonRequest[key];
            }
            if (key in jsonResponse) {
              return jsonResponse[key];
            }
          } catch (error) {
            // Ignore JSON parse errors
          }
        }
      }
    }
    return undefined;
  }

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
      attempts: this.attempts?.map((attempt) => attempt.toJSON()),
    };
  }
}