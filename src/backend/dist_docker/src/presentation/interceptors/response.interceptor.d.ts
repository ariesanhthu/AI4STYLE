import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SuccessResponseDto } from '@/shared/dtos/api-response.dto';
export declare class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponseDto> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponseDto>;
}
