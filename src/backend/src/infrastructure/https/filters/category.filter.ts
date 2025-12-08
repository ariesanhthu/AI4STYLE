import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  CategoryException,
  CategoryNotFoundException,
  CategorySlugAlreadyExistsException,
  CategoryCircularReferenceException,
  CategoryHasChildrenException,
  CategoryHasProductsException
} from '@/core/category/exceptions';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch(CategoryException)
export class CategoryExceptionFilter implements ExceptionFilter {
  catch(exception: CategoryException, host: ArgumentsHost) {
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.constructor) {
      case CategoryNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case CategorySlugAlreadyExistsException:
        status = HttpStatus.BAD_REQUEST;
        break;
      case CategoryCircularReferenceException:
        status = HttpStatus.BAD_REQUEST;
        break;
      case CategoryHasChildrenException:
        status = HttpStatus.BAD_REQUEST;
        break;
      case CategoryHasProductsException:
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
