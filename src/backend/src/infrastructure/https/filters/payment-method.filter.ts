import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  PaymentMethodException,
  PaymentMethodAlreadyExistsException,
  PaymentMethodNotFoundException
} from '@/core/payment-method/exceptions';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch(PaymentMethodException)
export class PaymentMethodExceptionFilter implements ExceptionFilter {
  catch(exception: PaymentMethodException, host: ArgumentsHost) {
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.constructor) {
      case PaymentMethodNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case PaymentMethodAlreadyExistsException:
        status = HttpStatus.BAD_REQUEST;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      throw exception;
    }

    const exceptionResponse: ExceptionResponse = {
      name: exception.name,
      message: exception.message,
    }
    throw new HttpException(exceptionResponse, status);
  }
}
