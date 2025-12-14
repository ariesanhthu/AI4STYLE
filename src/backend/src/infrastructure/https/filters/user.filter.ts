import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  UserException,
  UserAlreadyExistsException,
  UserNotFoundException,
  RootAdminCannotBeDeletedException
} from '@/core/user/exceptions';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch(UserException)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: UserException, host: ArgumentsHost) {
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.constructor) {
      case UserNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case UserAlreadyExistsException:
      case RootAdminCannotBeDeletedException:  
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
