import { EPaymentMethod } from '@/core/payment-method/enums';
import { PaymentEntity } from '../entities';
import { PaymentMethodEntity } from '@/core/payment-method/entities';

export interface IProvider {
  type: EPaymentMethod;
  create(
    paymentId: string,
    orderNumber: number,
    paymentMethod: PaymentMethodEntity,
    amount: number,
  ): Promise<Record<string, any>>;
  capture?(payment: PaymentEntity): Promise<PaymentEntity>;
  refund?(payment: PaymentEntity): Promise<PaymentEntity>;
  cancel?(payment: PaymentEntity): Promise<PaymentEntity>;
}

export interface IProviderGateway extends IProvider {
  handleIPN(
    ipnData: Record<string, any>,
  ): Promise<{ response: any; payment: PaymentEntity | undefined }>;
}
