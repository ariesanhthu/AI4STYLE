import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import z, { ZodObject, ZodType } from 'zod';
import 'reflect-metadata';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { successResponseSchema } from '@/shared/dtos/api-response.dto';

function getSwaggerType(zodType: ZodType): any {
  const typeName = zodType.def.type;
  switch (typeName) {
    case 'string':
      return String;
    case 'number':
      return Number;
    case 'boolean':
      return Boolean;
    default:
      return String;
  }
}

/**
 *  Decorator to generate Swagger query parameters from a Zod schema
 */
export function ApiZodQuery(schema: ZodObject<Record<string, ZodType>>) {
  const jsonSchema = z.toJSONSchema(schema);
  const required = jsonSchema.required ? jsonSchema.required : [];
  const decorators = Object.entries(jsonSchema.properties as Record<string, any>).map(([key, value]) => {
    return ApiQuery({ name: key, required: required.includes(key), type: String, enum: value.enum});
  });
  return applyDecorators(...decorators);  
}

/**
 * Decorator to generate Swagger body schema from a Zod schema
 */
export function ApiZodBody(schema: ZodObject<Record<string, ZodType>>) {
  const jsonSchema = z.toJSONSchema(schema);
  const decorators = [ApiBody({ schema: jsonSchema as SchemaObject })];

  return applyDecorators(...decorators);
}

export interface ApiZodResponseOptions {
  status: number;
  schema: ZodType;
  description?: string;
}

export function ApiZodResponse(options: ApiZodResponseOptions) {
  const jsonSchema = z.toJSONSchema(
    successResponseSchema.extend({ data: options.schema }),
  );
  return ApiResponse({
    status: options.status,
    description: options.description,
    schema: jsonSchema as SchemaObject,
  });
}

export function ApiZodErrorResponse(schema: ZodType) {
  const jsonSchema = z.toJSONSchema(schema);
  const decorators = [
    ApiResponse({
      status: '4XX',
      description: 'Error Response from client',
      schema: jsonSchema as SchemaObject,
    }),
    ApiResponse({
      status: '5XX',
      description: 'Error Response from server',
      schema: jsonSchema as SchemaObject,
    }),
  ];
  return applyDecorators(...decorators);
}
