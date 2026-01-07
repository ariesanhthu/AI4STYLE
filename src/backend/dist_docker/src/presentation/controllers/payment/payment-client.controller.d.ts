import { type CreatePaymentDto } from '@/application/payment/dtos';
import { BasePaymentController } from './base-payment.controller';
import { PaymentService } from '@/application/payment/services';
export declare class PaymentClientController extends BasePaymentController {
    protected readonly paymentService: PaymentService;
    constructor(paymentService: PaymentService);
    createPayment(body: CreatePaymentDto): Promise<Record<string, any>>;
}
