import type { PaymentEntity, PaymentAttemptEntity, PaymentTransactionEntity } from '../entities';
export interface IPaymentRepository {
    createWithAttempt(paymentData: PaymentEntity, attemptData: PaymentAttemptEntity): Promise<PaymentEntity>;
    createAttempt(attemptData: PaymentAttemptEntity): Promise<PaymentAttemptEntity>;
    updateAttempt(attemptData: PaymentAttemptEntity): Promise<PaymentAttemptEntity>;
    createTransaction(transactionData: PaymentTransactionEntity): Promise<PaymentTransactionEntity>;
    update(updateData: PaymentEntity): Promise<PaymentEntity>;
    findById(paymentId: string): Promise<PaymentEntity | null>;
    findByOrderId(orderId: string): Promise<PaymentEntity | null>;
    findByAttemptId(attemptId: string): Promise<PaymentEntity | null>;
    findAll(query: Record<string, any>): Promise<PaymentEntity[]>;
}
export declare const PAYMENT_REPOSITORY: unique symbol;
