import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ProductException,
  ProductCreationException,
  ProductDeletionException,
  ProductNotFoundException,
  ProductUpdateException,
  ProductOptionNotFoundException,
  ProductSlugAlreadyExistsException,
  ProductVariantNotFoundException,
  InsufficientInventoryException
} from '@/core/product/exceptions';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch(ProductException)
export class ProductExceptionFilter implements ExceptionFilter {
  catch(exception: ProductException, host: ArgumentsHost) {
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.constructor) {
      case ProductNotFoundException:
      case ProductOptionNotFoundException:
      case ProductVariantNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case ProductCreationException:
      case ProductDeletionException:
      case ProductUpdateException:
      case ProductSlugAlreadyExistsException:
      case InsufficientInventoryException:
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
