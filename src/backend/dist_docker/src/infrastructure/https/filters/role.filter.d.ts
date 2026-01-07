import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RoleException } from '@/core/role/exceptions';
export declare class RoleExceptionFilter implements ExceptionFilter {
    catch(exception: RoleException, host: ArgumentsHost): void;
}
