import z from 'zod';
export declare enum EProductSortOption {
    PRICE = "price",
    TIME = "time"
}
export declare const getListProductSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodEnum<typeof import("../../../shared/enums").ESortOrder>>>;
    category_id: z.ZodOptional<z.ZodString>;
    is_show: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    color_family: z.ZodOptional<z.ZodString>;
    min_price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    max_price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetListProductDto = z.infer<typeof getListProductSchema>;
export declare const getListProductClientSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodEnum<typeof import("../../../shared/enums").ESortOrder>>>;
    category_id: z.ZodOptional<z.ZodString>;
    color_family: z.ZodOptional<z.ZodString>;
    min_price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    max_price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    sortOption: z.ZodOptional<z.ZodEnum<typeof EProductSortOption>>;
}, z.core.$strip>;
export type GetListProductClientDto = z.infer<typeof getListProductClientSchema>;
