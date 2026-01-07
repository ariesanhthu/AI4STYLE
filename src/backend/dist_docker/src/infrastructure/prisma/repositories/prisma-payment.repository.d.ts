import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { PaymentAttemptEntity, PaymentEntity, PaymentTransactionEntity } from '@/core/payment/entities';
import { GetListOfPaymentsQueryDto } from '@/application/payment/dtos';
import { type IPaymentRepository } from '@/core/payment/interfaces';
export declare class PrismaPaymentRepository implements IPaymentRepository {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createWithAttempt(paymentData: PaymentEntity, attemptData: PaymentAttemptEntity): Promise<PaymentEntity>;
    createAttempt(attemptData: PaymentAttemptEntity): Promise<PaymentAttemptEntity>;
    updateAttempt(attemptData: PaymentAttemptEntity): Promise<PaymentAttemptEntity>;
    createTransaction(transactionData: PaymentTransactionEntity): Promise<PaymentTransactionEntity>;
    update(updateData: PaymentEntity): Promise<PaymentEntity>;
    findById(paymentId: string): Promise<PaymentEntity | null>;
    findByOrderId(orderId: string): Promise<PaymentEntity | null>;
    findByAttemptId(attemptId: string): Promise<PaymentEntity | null>;
    findAll(query: GetListOfPaymentsQueryDto): Promise<PaymentEntity[]>;
    private toPaymentEntity;
    private toAttemptEntity;
    private toTransactionEntity;
}
