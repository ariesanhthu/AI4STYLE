import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponseDto } from '@/shared/dtos/api-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponseDto> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseDto> {
    return next.handle().pipe(
      map(
        (data) =>
          ({
            success: true,
            data,
            code: context.switchToHttp().getResponse().statusCode,
            timestamp: new Date().toISOString(),
          }) as SuccessResponseDto,
      ),
    );
  }
}
