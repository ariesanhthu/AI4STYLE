import { z } from 'zod';
export declare const getBestSellerSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type GetBestSellerDto = z.infer<typeof getBestSellerSchema>;
