import type { PaymentEntity, PaymentTransactionEntity } from '../entities';
import type { GetListOfPaymentsQueryDto } from '../dtos';

export interface IPaymentRepository {
  /**
   * Create a new payment
   */
  createPayment(paymentData: PaymentEntity): Promise<PaymentEntity>;

  /**
   * Create a payment transaction
   */
  createPaymentTransaction(
    transactionData: PaymentTransactionEntity,
  ): Promise<PaymentTransactionEntity>;

  /**
   * Update payment status and other fields
   */
  updatePayment(
    updateData: PaymentEntity,
  ): Promise<PaymentEntity>;

  /**
   * Get payment by ID with transactions populated
   */
  getPaymentById(paymentId: string): Promise<PaymentEntity | null>;

  /**
   * Get payment by order ID with transactions populated
   */
  getPaymentByOrderId(orderId: string): Promise<PaymentEntity | null>;

  /**
   * Get list of payments with transactions populated
   */
  getPaymentsList(query: GetListOfPaymentsQueryDto): Promise<PaymentEntity[]>;
}

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';
