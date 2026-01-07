import { ZodObject, ZodType } from 'zod';
import 'reflect-metadata';
export declare function ApiZodQuery(schema: ZodObject<Record<string, ZodType>>): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiZodBody(schema: ZodObject<Record<string, ZodType>>): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export interface ApiZodResponseOptions {
    status: number;
    schema: ZodType;
    description?: string;
}
export declare function ApiZodResponse(options: ApiZodResponseOptions): MethodDecorator & ClassDecorator;
export declare function ApiZodErrorResponse(schema: ZodType): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
