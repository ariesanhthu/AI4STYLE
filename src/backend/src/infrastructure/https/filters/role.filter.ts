import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  RoleException,
  RoleAlreadyExistsException,
  RoleDeletionException,
  RoleNotFoundException,
  RoleUpdateException,
  RoleRootAdminCannotBeDeletedException,
  RoleRootAdminCannotBeUpdatedException,
  RoleGuestCannotBeDeletedException,
  RoleGuestCannotBeUpdatedException,
} from '@/core/role/exceptions';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch(RoleException)
export class RoleExceptionFilter implements ExceptionFilter {
  catch(exception: RoleException, host: ArgumentsHost) {
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.constructor) {
      case RoleNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case RoleAlreadyExistsException:
      case RoleDeletionException:
      case RoleUpdateException:
      case RoleRootAdminCannotBeDeletedException:
      case RoleRootAdminCannotBeUpdatedException:
      case RoleGuestCannotBeDeletedException:
      case RoleGuestCannotBeUpdatedException:
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
