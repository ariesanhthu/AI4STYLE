import z from 'zod';
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    icon: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    parentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
