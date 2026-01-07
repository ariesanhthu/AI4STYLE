import { GeneralIpn } from './interfaces';
import { CreatePaymentResponseDto } from '@/application/payment/dtos';
import { PaymentEntity } from '@/core/payment/entities';
import { HttpService } from '@nestjs/axios/dist/http.service';
import { IProviderGateway, type IPaymentRepository } from '@/core/payment/interfaces';
import { EPaymentMethod } from '@/core/payment-method/enums';
import { PaymentMethodEntity } from '@/core/payment-method/entities';
import { IUnitOfWorkSession } from '@/application/shared';
export declare class MomoService implements IProviderGateway {
    private readonly httpService;
    private readonly paymentRepository;
    constructor(httpService: HttpService, paymentRepository: IPaymentRepository);
    private readonly logger;
    type: EPaymentMethod;
    create(paymentId: string, orderNumber: number, paymentMethod: PaymentMethodEntity, amount: number, session: IUnitOfWorkSession): Promise<CreatePaymentResponseDto>;
    capture(payment: PaymentEntity, session: IUnitOfWorkSession): Promise<PaymentEntity>;
    refund(payment: PaymentEntity, session: IUnitOfWorkSession): Promise<PaymentEntity>;
    cancel(payment: PaymentEntity, session: IUnitOfWorkSession): Promise<PaymentEntity>;
    handleIPN(body: GeneralIpn, session: IUnitOfWorkSession): Promise<{
        response: any;
        payment: PaymentEntity | undefined;
    }>;
    private momoConfirm;
    private generateMomoOrderId;
    private extractMomoOrderId;
    private loadMomoConfig;
}
