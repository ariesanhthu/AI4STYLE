import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ZodObject, ZodType } from 'zod';
import 'reflect-metadata';

/**
 *  Decorator to generate Swagger query parameters from a Zod schema
 */ 
export function ApiZodQuery(schema: ZodObject<Record<string, ZodType>>) {
  const shape = schema.shape;
  const decorators = Object.entries(shape).map(([key, value]) => {
    const isRequired = schema.safeParse(undefined).success;
    const type = getSwaggerType(value);
    return ApiQuery({ name: key, required: isRequired, type });
  });
  return applyDecorators(...decorators);
}

function getSwaggerType(zodType: ZodType): any {
  const typeName = zodType.def.type;
  switch (typeName) {
    case 'string': return String;
    case 'number': return Number;
    case 'boolean': return Boolean;
    default: return String;
  }
}