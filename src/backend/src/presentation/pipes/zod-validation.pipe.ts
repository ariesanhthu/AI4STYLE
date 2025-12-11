import { ExceptionResponse } from '@/shared/interfaces';
import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import z, { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const parsedValue = this.schema.safeParse(value);
    if (!parsedValue.success) {
      const pretty = z.prettifyError(parsedValue.error);
      // const formattedErrors = parsedValue.error.issues.map((err) => ({
      //   field: err.path.join('.'),
      //   message: err.message,
      // }));
      throw new BadRequestException({
        name: 'Validation failed',
        message: pretty,
      } as ExceptionResponse);
    }
    return parsedValue.data;
  }
}
