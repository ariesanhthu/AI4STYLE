import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { UserException } from '@/core/user/exceptions';
export declare class UserExceptionFilter implements ExceptionFilter {
    catch(exception: UserException, host: ArgumentsHost): void;
}
