import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  OrderException,
  OrderNotFoundException,
  InvalidOrderStatusException,
  OrderCancellationFailedException,
  OrderCreationFailedException
} from '@/core/order/exceptions';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch(OrderException)
export class OrderExceptionFilter implements ExceptionFilter {
  catch(exception: OrderException, host: ArgumentsHost) {
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.constructor) {
      case OrderNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case InvalidOrderStatusException:
      case OrderCancellationFailedException:
      case OrderCreationFailedException:
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
