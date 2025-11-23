import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  AuthException,
  EmailAlreadyRegisteredException,
  InvalidCredentialsException,
  InvalidOtpException,
  InvalidRefreshTokenException,
  OldPasswordIncorrectException,
  RoleNotFoundException,
  UserNotFoundException,
} from '@/core/auth/exceptions';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch(AuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: AuthException, host: ArgumentsHost) {
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.constructor) {
      case EmailAlreadyRegisteredException:
      case InvalidCredentialsException:
      case InvalidOtpException:
      case InvalidRefreshTokenException:
      case OldPasswordIncorrectException:
        status = HttpStatus.BAD_REQUEST;
        break;
      case UserNotFoundException:
      case RoleNotFoundException:
        status = HttpStatus.NOT_FOUND;
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
