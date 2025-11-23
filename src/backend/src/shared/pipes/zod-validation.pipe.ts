import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const parsedValue = this.schema.safeParse(value);
    if (!parsedValue.success) {
      const formattedErrors = parsedValue.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new BadRequestException({
        message: `Validation failed: ${formattedErrors}`,
        errors: formattedErrors,
      });
    }
    return parsedValue.data;
  }
}
