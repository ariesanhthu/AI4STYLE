import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { OrderException } from '@/core/order/exceptions';
export declare class OrderExceptionFilter implements ExceptionFilter {
    catch(exception: OrderException, host: ArgumentsHost): void;
}
