import { z } from 'zod';
declare const updateOptionSchema: z.ZodObject<{
    optionId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    colorFamily: z.ZodOptional<z.ZodString>;
    thumbnail: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodString>>;
    isShow: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        optionId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
        colorFamily: z.ZodOptional<z.ZodString>;
        thumbnail: z.ZodOptional<z.ZodString>;
        images: z.ZodOptional<z.ZodArray<z.ZodString>>;
        isShow: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    newOptions: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>>;
    deleteOptionIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type UpdateOptionInput = z.infer<typeof updateOptionSchema>;
export {};
