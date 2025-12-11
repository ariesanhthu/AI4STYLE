import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDto } from '@/shared/dtos';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Unexpected error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        error = exception.name;
        message = response;
      } else if (typeof response === 'object') {
        error = (response as ExceptionResponse).name;
        message = (response as ExceptionResponse).message;
      } else {
        error = exception.name;
        message = exception.message;
      }
    }

    const errorResponse: ErrorResponseDto = {
      code: status,
      message,
      error,
      success: false,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
