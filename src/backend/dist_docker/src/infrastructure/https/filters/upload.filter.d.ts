import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { UploadException } from '@/core/upload/exceptions';
export declare class UploadExceptionFilter implements ExceptionFilter {
    catch(exception: UploadException, host: ArgumentsHost): void;
}
