import { z } from 'zod';
export declare const variantSchema: z.ZodObject<{
    sku: z.ZodString;
    size: z.ZodString;
    price: z.ZodNumber;
    newPrice: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    stockQuantity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const optionSchema: z.ZodObject<{
    name: z.ZodString;
    color: z.ZodString;
    colorFamily: z.ZodString;
    thumbnail: z.ZodString;
    images: z.ZodArray<z.ZodString>;
    isShow: z.ZodDefault<z.ZodBoolean>;
    variants: z.ZodArray<z.ZodObject<{
        sku: z.ZodString;
        size: z.ZodString;
        price: z.ZodNumber;
        newPrice: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        stockQuantity: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const createProductSchema: z.ZodObject<{
    categoryId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    options: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        color: z.ZodString;
        colorFamily: z.ZodString;
        thumbnail: z.ZodString;
        images: z.ZodArray<z.ZodString>;
        isShow: z.ZodDefault<z.ZodBoolean>;
        variants: z.ZodArray<z.ZodObject<{
            sku: z.ZodString;
            size: z.ZodString;
            price: z.ZodNumber;
            newPrice: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            stockQuantity: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type ProductOptionInput = z.infer<typeof optionSchema>;
export type ProductVariantInput = z.infer<typeof variantSchema>;
