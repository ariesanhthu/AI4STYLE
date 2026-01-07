import { EPaymentMethod } from '@/core/payment-method/enums';
import { EPaymentStatus, ETransactionType } from '../enums';
import { PaymentAttemptEntity } from './payment-attempt.entity';
export declare class PaymentEntity {
    readonly paymentId: string;
    readonly orderId: string;
    paymentMethodId: string;
    amount: number;
    type: EPaymentMethod;
    status: EPaymentStatus;
    readonly createdAt: Date;
    updatedAt: Date;
    attempts?: PaymentAttemptEntity[] | undefined;
    constructor(paymentId: string, orderId: string, paymentMethodId: string, amount: number, type: EPaymentMethod, status: EPaymentStatus, createdAt: Date, updatedAt: Date, attempts?: PaymentAttemptEntity[] | undefined);
    getLatestAttempt(): PaymentAttemptEntity | undefined;
    canCreateNewAttempt(): boolean;
    syncStatusFromLatestAttempt(): void;
    cancelLastPendingAttempt(): void;
    getNextAttemptOrderNumber(): number;
    getAttemptById(attemptId: string): PaymentAttemptEntity | undefined;
    getValueInTransactionPayload(key: string, type: ETransactionType): string | undefined;
    toJSON(): {
        paymentId: string;
        orderId: string;
        paymentMethodId: string;
        amount: number;
        type: EPaymentMethod;
        status: EPaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        attempts: {
            paymentAttemptId: string;
            paymentId: string;
            paymentMethodId: string;
            type: EPaymentMethod;
            orderNumber: number;
            status: EPaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            transactions: {
                transactionId: string;
                paymentAttemptId: string;
                requestBody: any;
                responseBody: any;
                type: ETransactionType;
                createdAt: Date;
                updatedAt: Date;
            }[] | undefined;
        }[] | undefined;
    };
}
