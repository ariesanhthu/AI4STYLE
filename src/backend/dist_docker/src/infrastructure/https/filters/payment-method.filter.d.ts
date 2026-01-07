import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { PaymentMethodException } from '@/core/payment-method/exceptions';
export declare class PaymentMethodExceptionFilter implements ExceptionFilter {
    catch(exception: PaymentMethodException, host: ArgumentsHost): void;
}
