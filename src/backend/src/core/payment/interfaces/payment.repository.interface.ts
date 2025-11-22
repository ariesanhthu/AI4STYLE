import type {
  PaymentEntity,
  PaymentAttemptEntity,
  PaymentTransactionEntity,
} from '../entities';

export interface IPaymentRepository {
  /**
   * Create a new payment with initial attempt
   */
  createPaymentWithAttempt(
    paymentData: PaymentEntity,
    attemptData: PaymentAttemptEntity,
  ): Promise<PaymentEntity>;

  /**
   * Create a new payment attempt
   */
  createPaymentAttempt(
    attemptData: PaymentAttemptEntity,
  ): Promise<PaymentAttemptEntity>;

  /**
   * Update payment attempt status
   */
  updatePaymentAttempt(
    attemptData: PaymentAttemptEntity,
  ): Promise<PaymentAttemptEntity>;

  /**
   * Create a payment transaction
   */
  createPaymentTransaction(
    transactionData: PaymentTransactionEntity,
  ): Promise<PaymentTransactionEntity>;

  /**
   * Update payment status and other fields
   */
  updatePayment(updateData: PaymentEntity): Promise<PaymentEntity>;

  /**
   * Get payment by ID with attempts and transactions populated
   */
  getPaymentById(paymentId: string): Promise<PaymentEntity | null>;

  /**
   * Get payment by order ID with attempts and transactions populated
   */
  getPaymentByOrderId(orderId: string): Promise<PaymentEntity | null>;

  /**
   * Get payment by attempt ID with attempts and transactions populated
   */
  getPaymentByAttemptId(attemptId: string): Promise<PaymentEntity | null>;

  /**
   * Get list of payments with attempts and transactions populated
   */
  getPaymentsList(query: Record<string, any>): Promise<PaymentEntity[]>;
}

export const PAYMENT_REPOSITORY = Symbol('IPaymentRepository');
