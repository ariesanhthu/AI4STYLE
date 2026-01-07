import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ProductException } from '@/core/product/exceptions';
export declare class ProductExceptionFilter implements ExceptionFilter {
    catch(exception: ProductException, host: ArgumentsHost): void;
}
