import type {
  PaymentEntity,
  PaymentAttemptEntity,
  PaymentTransactionEntity,
} from '../entities';

export interface IPaymentRepository {
  /**
   * Create a new payment with initial attempt
   */
  createWithAttempt(
    paymentData: PaymentEntity,
    attemptData: PaymentAttemptEntity,
  ): Promise<PaymentEntity>;

  /**
   * Create a new payment attempt
   */
  createAttempt(
    attemptData: PaymentAttemptEntity,
  ): Promise<PaymentAttemptEntity>;

  /**
   * Update payment attempt status
   */
  updateAttempt(
    attemptData: PaymentAttemptEntity,
  ): Promise<PaymentAttemptEntity>;

  /**
   * Create a payment transaction
   */
  createTransaction(
    transactionData: PaymentTransactionEntity,
  ): Promise<PaymentTransactionEntity>;

  /**
   * Update payment status and other fields
   */
  update(updateData: PaymentEntity): Promise<PaymentEntity>;

  /**
   * Get payment by ID with attempts and transactions populated
   */
  findById(paymentId: string): Promise<PaymentEntity | null>;

  /**
   * Get payment by order ID with attempts and transactions populated
   */
  findByOrderId(orderId: string): Promise<PaymentEntity | null>;

  /**
   * Get payment by attempt ID with attempts and transactions populated
   */
  findByAttemptId(attemptId: string): Promise<PaymentEntity | null>;

  /**
   * Get list of payments with attempts and transactions populated
   */
  findAll(query: Record<string, any>): Promise<PaymentEntity[]>;
}

export const PAYMENT_REPOSITORY = Symbol('IPaymentRepository');
