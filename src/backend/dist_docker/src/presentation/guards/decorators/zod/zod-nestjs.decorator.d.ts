import { ZodType } from 'zod';
export declare function ZodBody(schema: ZodType, property?: string): ParameterDecorator;
export declare function ZodQuery(schema: ZodType, property?: string): ParameterDecorator;
export declare function ZodParam(schema: ZodType, property?: string): ParameterDecorator;
