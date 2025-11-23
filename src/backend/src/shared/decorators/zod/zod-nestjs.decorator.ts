import { Body, Query, Param } from '@nestjs/common';
import { ZodType } from 'zod';
import { ZodValidationPipe } from '@/shared/pipes';

/**
 * ZodBody decorator - validates request body using Zod schema
 * @param schema - Zod schema to validate against
 * @param property - Optional property name to extract from body (like Body('id'))
 * @example
 * ```typescript
 * // Validate entire body
 * @Post()
 * create(@ZodBody(createUserSchema) body: CreateUserDto) {}
 *
 * // Extract specific field
 * @Post()
 * create(@ZodBody(z.string(), 'email') email: string) {}
 * ```
 */
export function ZodBody(
  schema: ZodType,
  property?: string,
): ParameterDecorator {
  if (property) {
    return Body(property, new ZodValidationPipe(schema));
  }
  return Body(new ZodValidationPipe(schema));
}

/**
 * ZodQuery decorator - validates query parameters using Zod schema
 * @param schema - Zod schema to validate against
 * @param property - Optional property name to extract from query (like Query('page'))
 * @example
 * ```typescript
 * // Validate entire query object
 * @Get()
 * findAll(@ZodQuery(searchQuerySchema) query: SearchQueryDto) {}
 *
 * // Extract specific query param
 * @Get()
 * findAll(@ZodQuery(z.string(), 'search') search: string) {}
 * ```
 */
export function ZodQuery(
  schema: ZodType,
  property?: string,
): ParameterDecorator {
  if (property) {
    return Query(property, new ZodValidationPipe(schema));
  }
  return Query(new ZodValidationPipe(schema));
}

/**
 * ZodParam decorator - validates route parameters using Zod schema
 * @param schema - Zod schema to validate against
 * @param property - Optional property name to extract from params (like Param('id'))
 * @example
 * ```typescript
 * // Validate entire params object
 * @Get(':id')
 * findOne(@ZodParam(paramsSchema) params: ParamsDto) {}
 *
 * // Extract specific param
 * @Get(':id')
 * findOne(@ZodParam(z.string().uuid(), 'id') id: string) {}
 * ```
 */
export function ZodParam(
  schema: ZodType,
  property?: string,
): ParameterDecorator {
  if (property) {
    return Param(property, new ZodValidationPipe(schema));
  }
  return Param(new ZodValidationPipe(schema));
}
