import z from 'zod';
export declare const imageResponseSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    format: z.ZodString;
    size: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export declare const imageArrayResponseSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    format: z.ZodString;
    size: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>>;
