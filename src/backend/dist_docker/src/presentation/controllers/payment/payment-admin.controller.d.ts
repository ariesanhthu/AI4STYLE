import { type GetListOfPaymentsQueryDto } from '@/application/payment/dtos';
import { BasePaymentController } from './base-payment.controller';
import { PaymentService } from '@/application/payment/services';
import { type MomoIpn } from '@/infrastructure/services/payment-providers/interfaces';
import { EPaymentMethod } from '@/core/payment-method/enums';
export declare class PaymentAdminController extends BasePaymentController {
    protected readonly paymentService: PaymentService;
    constructor(paymentService: PaymentService);
    getListOfPayments(query: GetListOfPaymentsQueryDto): Promise<{
        items: {
            paymentId: string;
            orderId: string;
            paymentMethodId: string;
            amount: number;
            type: EPaymentMethod;
            status: import("../../../core/payment/enums").EPaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            attempts: {
                paymentAttemptId: string;
                paymentId: string;
                paymentMethodId: string;
                type: EPaymentMethod;
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
        }[];
        nextCursor: string | null;
    }>;
    capturePayment(id: string): Promise<import("../../../core/payment/entities").PaymentEntity>;
    cancelPayment(id: string): Promise<import("../../../core/payment/entities").PaymentEntity>;
    refundPayment(id: string): Promise<import("../../../core/payment/entities").PaymentEntity>;
    handleMoMoIPN(payload: MomoIpn): Promise<any>;
}
