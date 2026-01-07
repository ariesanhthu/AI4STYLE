import { EPaymentMethod } from '@/core/payment-method/enums';
import { EPaymentStatus } from '../enums';
import { PaymentTransactionEntity } from './payment-transaction.entity';
export declare class PaymentAttemptEntity {
    readonly paymentAttemptId: string;
    readonly paymentId: string;
    paymentMethodId: string;
    type: EPaymentMethod;
    orderNumber: number;
    status: EPaymentStatus;
    readonly createdAt: Date;
    updatedAt: Date;
    transactions?: PaymentTransactionEntity[] | undefined;
    constructor(paymentAttemptId: string, paymentId: string, paymentMethodId: string, type: EPaymentMethod, orderNumber: number, status: EPaymentStatus, createdAt: Date, updatedAt: Date, transactions?: PaymentTransactionEntity[] | undefined);
    canBeRetried(): boolean;
    isFinalState(): boolean;
    cancel(): void;
    toJSON(): {
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
            type: import("../enums").ETransactionType;
            createdAt: Date;
            updatedAt: Date;
        }[] | undefined;
    };
}
