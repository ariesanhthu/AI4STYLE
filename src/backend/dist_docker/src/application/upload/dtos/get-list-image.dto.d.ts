import z from 'zod';
export declare const getListImageSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodEnum<typeof import("../../../shared/enums").ESortOrder>>>;
}, z.core.$strip>;
export type GetListImageDto = z.infer<typeof getListImageSchema>;
