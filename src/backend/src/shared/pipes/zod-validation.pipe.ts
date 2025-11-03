import { PipeTransform, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    console.log(`Validating ${metadata.type}:`, value);
    const parsedValue = this.schema.safeParse(value);
    if (!parsedValue.success) {
      console.log('Validation errors:', parsedValue.error.issues);
      const formattedErrors = parsedValue.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new BadRequestException({
        message: `Validation failed: ${formattedErrors}`,
        errors: formattedErrors,
      });
    }
    this.logger.debug(`Validation succeeded for ${metadata.type}`);
    this.logger.debug(`Validated data: ${JSON.stringify(parsedValue.data)}`);
    return parsedValue.data;
  }
}
