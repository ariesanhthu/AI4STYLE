import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { CategoryException } from '@/core/category/exceptions';
export declare class CategoryExceptionFilter implements ExceptionFilter {
    catch(exception: CategoryException, host: ArgumentsHost): void;
}
