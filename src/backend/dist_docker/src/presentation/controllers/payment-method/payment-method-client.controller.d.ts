import { PaymentMethodService } from '@/application/payment-method/services';
export declare class PaymentMethodClientController {
    protected readonly paymentMethodService: PaymentMethodService;
    constructor(paymentMethodService: PaymentMethodService);
    getAllPaymentMethods(): Promise<{
        paymentMethodId: string;
        displayName: string;
        type: import("../../../core/payment-method/enums").EPaymentMethod;
        icon: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
