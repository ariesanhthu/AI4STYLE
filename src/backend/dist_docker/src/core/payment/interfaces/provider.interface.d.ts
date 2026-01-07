import { EPaymentMethod } from '@/core/payment-method/enums';
import { PaymentEntity } from '../entities';
import { PaymentMethodEntity } from '@/core/payment-method/entities';
import { IUnitOfWorkSession } from '@/application/shared';
export interface IProvider {
    type: EPaymentMethod;
    create(paymentId: string, orderNumber: number, paymentMethod: PaymentMethodEntity, amount: number, session: IUnitOfWorkSession): Promise<Record<string, any>>;
    capture?(payment: PaymentEntity, session: IUnitOfWorkSession): Promise<PaymentEntity>;
    refund?(payment: PaymentEntity, session: IUnitOfWorkSession): Promise<PaymentEntity>;
    cancel?(payment: PaymentEntity, session: IUnitOfWorkSession): Promise<PaymentEntity>;
}
export interface IProviderGateway extends IProvider {
    handleIPN(ipnData: Record<string, any>, session: IUnitOfWorkSession): Promise<{
        response: any;
        payment: PaymentEntity | undefined;
    }>;
}
