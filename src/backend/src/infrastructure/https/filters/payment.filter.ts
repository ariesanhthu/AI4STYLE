import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  PaymentException,
  PaymentNotFoundException,
  PaymentCaptureFailedException,
  PaymentRefundFailedException,
  PaymentProviderNotFoundException,
  InvalidPaymentMethodException,
  InvalidPaymentStatusException,
  OrderNotFoundException
} from '@/core/payment/exceptions';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch(PaymentException)
export class PaymentExceptionFilter implements ExceptionFilter {
  catch(exception: PaymentException, host: ArgumentsHost) {
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.constructor) {
      case PaymentNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case PaymentCaptureFailedException:
      case PaymentRefundFailedException:
      case PaymentProviderNotFoundException:
      case InvalidPaymentMethodException:
      case InvalidPaymentStatusException:
      case OrderNotFoundException:
        status = HttpStatus.BAD_REQUEST;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const exceptionResponse: ExceptionResponse = {
      name: exception.name,
      message: exception.message,
    }
    throw new HttpException(exceptionResponse, status);
  }
}
