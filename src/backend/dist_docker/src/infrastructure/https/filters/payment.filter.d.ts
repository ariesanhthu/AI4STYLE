import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { PaymentException } from '@/core/payment/exceptions';
export declare class PaymentExceptionFilter implements ExceptionFilter {
    catch(exception: PaymentException, host: ArgumentsHost): void;
}
