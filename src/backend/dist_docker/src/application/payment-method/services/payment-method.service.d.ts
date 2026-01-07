import { EPaymentMethod } from '@/core/payment-method/enums';
import { type IPaymentMethodRepository } from '@/core/payment-method/interfaces';
import { ILoggerService } from '@/shared/interfaces';
export declare class PaymentMethodService {
    private readonly paymentMethodRepository;
    private readonly logger;
    constructor(paymentMethodRepository: IPaymentMethodRepository, logger: ILoggerService);
    getPaymentMethodById(id: string): Promise<{
        paymentMethodId: string;
        displayName: string;
        type: EPaymentMethod;
        icon: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllPaymentMethods(): Promise<{
        paymentMethodId: string;
        displayName: string;
        type: EPaymentMethod;
        icon: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    initializeDefaultPaymentMethods(): Promise<void>;
}
