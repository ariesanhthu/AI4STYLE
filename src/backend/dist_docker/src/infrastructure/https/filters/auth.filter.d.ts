import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { AuthException } from '@/core/auth/exceptions';
export declare class AuthExceptionFilter implements ExceptionFilter {
    catch(exception: AuthException, host: ArgumentsHost): void;
}
