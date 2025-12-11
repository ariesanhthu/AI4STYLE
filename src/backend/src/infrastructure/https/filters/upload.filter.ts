import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  UploadException,
  ImageUploadFailedException,
  ImageDeletionFailedException,
  ImageNotFoundException
} from '@/core/upload/exceptions';
import { ExceptionResponse } from '@/shared/interfaces';

@Catch(UploadException)
export class UploadExceptionFilter implements ExceptionFilter {
  catch(exception: UploadException, host: ArgumentsHost) {
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.constructor) {
      case ImageNotFoundException:
        status = HttpStatus.NOT_FOUND;
        break;
      case ImageUploadFailedException:
      case ImageDeletionFailedException:
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
