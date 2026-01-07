import { CreatePaymentResponseDto } from '@/application/payment/dtos';
import { PaymentEntity } from '@/core/payment/entities';
import { EPaymentMethod } from '@/core/payment-method/enums';
import { PaymentMethodEntity } from '@/core/payment-method/entities';
import { type IPaymentRepository, IProvider } from '@/core/payment/interfaces';
import { IUnitOfWorkSession } from '@/application/shared';
export declare class CashService implements IProvider {
    private readonly paymentRepository;
    constructor(paymentRepository: IPaymentRepository);
    type: EPaymentMethod;
    create(paymentId: string, orderNumber: number, paymentMethod: PaymentMethodEntity, amount: number, session: IUnitOfWorkSession): Promise<CreatePaymentResponseDto>;
    capture(payment: PaymentEntity, session: IUnitOfWorkSession): Promise<PaymentEntity>;
    refund(payment: PaymentEntity, session: IUnitOfWorkSession): Promise<PaymentEntity>;
    cancel(payment: PaymentEntity, session: IUnitOfWorkSession): Promise<PaymentEntity>;
}
