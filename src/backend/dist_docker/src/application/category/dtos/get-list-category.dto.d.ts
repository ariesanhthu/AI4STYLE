import z from "zod";
export declare const getListCategorySchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodEnum<typeof import("../../../shared/enums").ESortOrder>>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetListCategoryDto = z.infer<typeof getListCategorySchema>;
