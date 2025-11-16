import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import z, { ZodObject, ZodType } from 'zod';
import 'reflect-metadata';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';


function getSwaggerType(zodType: ZodType): any {
  const typeName = zodType.def.type;
  switch (typeName) {
    case 'string': return String;
    case 'number': return Number;
    case 'boolean': return Boolean;
    default: return String;
  }
}

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

/**  
 * Decorator to generate Swagger body schema from a Zod schema
 */
export function ApiZodBody(schema: ZodObject<Record<string, ZodType>>) {
  const jsonSchema = z.toJSONSchema(schema);
  const decorators = [
    ApiBody({ schema: jsonSchema as SchemaObject })
  ];

  return applyDecorators(...decorators);
}