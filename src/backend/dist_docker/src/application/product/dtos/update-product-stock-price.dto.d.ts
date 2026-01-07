import z from 'zod';
export declare const updateVariantStockPriceSchema: z.ZodObject<{
    variantId: z.ZodString;
    price: z.ZodOptional<z.ZodNumber>;
    newPrice: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    stockQuantity: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateProductStockPriceSchema: z.ZodObject<{
    variants: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        price: z.ZodOptional<z.ZodNumber>;
        newPrice: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        stockQuantity: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type UpdateVariantStockPriceDto = z.infer<typeof updateVariantStockPriceSchema>;
export type UpdateProductStockPriceDto = z.infer<typeof updateProductStockPriceSchema>;
export declare const modifyProductVariantStockSchema: z.ZodObject<{
    variants: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        stockChange: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ModifyProductVariantStockDto = z.infer<typeof modifyProductVariantStockSchema>;
