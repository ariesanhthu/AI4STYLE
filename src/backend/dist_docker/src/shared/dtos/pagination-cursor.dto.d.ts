import { ESortOrder } from '../enums';
import z from 'zod';
export declare const paginationCursorQuerySchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodEnum<typeof ESortOrder>>>;
}, z.core.$strip>;
export type PaginationCursorQueryDto = z.infer<typeof paginationCursorQuerySchema>;
export declare const paginationCursorResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodAny>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type PaginationCursorResponseDto = z.infer<typeof paginationCursorResponseSchema>;
export declare const createPaginationCursorResponseSchema: <T extends z.ZodTypeAny>(itemSchema: T) => z.ZodObject<{
    items: z.ZodArray<T>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
