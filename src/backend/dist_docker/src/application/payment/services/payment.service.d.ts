import { CreatePaymentDto, GetListOfPaymentsQueryDto } from '@/application/payment/dtos';
import { type IPaymentRepository, type IProviderDiscovery } from '@/core/payment/interfaces';
import { PaymentEntity } from '@/core/payment/entities';
import { EPaymentMethod } from '@/core/payment-method/enums';
import { EPaymentStatus } from '@/core/payment/enums';
import { GeneralIpn } from '@/infrastructure/services/payment-providers/interfaces';
import { ILoggerService } from '@/shared/interfaces';
import { IUnitOfWork } from '@/application/shared';
export declare class PaymentService {
    private readonly providerDiscoveryService;
    private readonly paymentRepository;
    private readonly logger;
    private readonly unitOfWork;
    constructor(providerDiscoveryService: IProviderDiscovery, paymentRepository: IPaymentRepository, logger: ILoggerService, unitOfWork: IUnitOfWork);
    createPayment(body: CreatePaymentDto): Promise<Record<string, any>>;
    cancelPayment(paymentId: string): Promise<PaymentEntity>;
    refundPayment(paymentId: string): Promise<PaymentEntity>;
    capturePayment(paymentId: string): Promise<PaymentEntity>;
    handleProviderWebhook(type: EPaymentMethod, payload: GeneralIpn): Promise<any>;
    getPaymentById(paymentId: string): Promise<{
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
                type: import("@/core/payment/enums").ETransactionType;
                createdAt: Date;
                updatedAt: Date;
            }[] | undefined;
        }[] | undefined;
    }>;
    getListOfPayments(query: GetListOfPaymentsQueryDto): Promise<{
        items: {
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
                    type: import("@/core/payment/enums").ETransactionType;
                    createdAt: Date;
                    updatedAt: Date;
                }[] | undefined;
            }[] | undefined;
        }[];
        nextCursor: string | null;
    }>;
}
