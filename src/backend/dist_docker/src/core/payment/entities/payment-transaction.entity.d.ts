import { ETransactionType } from '../enums';
export declare class PaymentTransactionEntity {
    readonly transactionId: string;
    readonly paymentAttemptId: string;
    requestBody: string;
    responseBody: string;
    type: ETransactionType;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(transactionId: string, paymentAttemptId: string, requestBody: string, responseBody: string, type: ETransactionType, createdAt: Date, updatedAt: Date);
    toJSON(): {
        transactionId: string;
        paymentAttemptId: string;
        requestBody: any;
        responseBody: any;
        type: ETransactionType;
        createdAt: Date;
        updatedAt: Date;
    };
}
