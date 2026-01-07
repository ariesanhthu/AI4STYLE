import { PaymentMethodEntity } from '../entities';
export interface IPaymentMethodRepository {
    findById(id: string): Promise<PaymentMethodEntity | null>;
    findAll(): Promise<PaymentMethodEntity[]>;
    create(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity>;
    update(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity>;
    delete(id: string): Promise<boolean>;
}
export declare const PAYMENT_METHOD_REPOSITORY: unique symbol;
