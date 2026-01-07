import { EPaymentMethod } from '../enums';
export declare class PaymentMethodEntity {
    readonly paymentMethodId: string;
    displayName: string;
    type: EPaymentMethod;
    icon: string | null;
    description: string | null;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(paymentMethodId: string, displayName: string, type: EPaymentMethod, icon: string | null, description: string | null, createdAt: Date, updatedAt: Date);
    toJSON(): {
        paymentMethodId: string;
        displayName: string;
        type: EPaymentMethod;
        icon: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}
