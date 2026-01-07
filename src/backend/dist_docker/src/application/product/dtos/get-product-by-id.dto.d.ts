import z from 'zod';
export declare const getProductByIdQuerySchema: z.ZodObject<{
    includeOptions: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    includeVariants: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
export type GetProductByIdQueryDto = z.infer<typeof getProductByIdQuerySchema>;
