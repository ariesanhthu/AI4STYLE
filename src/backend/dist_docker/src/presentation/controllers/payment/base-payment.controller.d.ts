import { PaymentService } from '@/application/payment/services';
export declare abstract class BasePaymentController {
    protected readonly paymentService: PaymentService;
    constructor(paymentService: PaymentService);
    getPaymentById(id: string): Promise<{
        paymentId: string;
        orderId: string;
        paymentMethodId: string;
        amount: number;
        type: import("../../../core/payment-method/enums").EPaymentMethod;
        status: import("../../../core/payment/enums").EPaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        attempts: {
            paymentAttemptId: string;
            paymentId: string;
            paymentMethodId: string;
            type: import("../../../core/payment-method/enums").EPaymentMethod;
            orderNumber: number;
            status: import("../../../core/payment/enums").EPaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            transactions: {
                transactionId: string;
                paymentAttemptId: string;
                requestBody: any;
                responseBody: any;
                type: import("../../../core/payment/enums").ETransactionType;
                createdAt: Date;
                updatedAt: Date;
            }[] | undefined;
        }[] | undefined;
    }>;
}
