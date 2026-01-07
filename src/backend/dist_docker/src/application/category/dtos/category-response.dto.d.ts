import z from 'zod';
export declare const baseCategoryResponseSchema: z.ZodObject<{
    categoryId: z.ZodString;
    parentId: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    slug: z.ZodString;
    icon: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export declare const categoryResponseSchema: z.ZodObject<{
    categoryId: z.ZodString;
    parentId: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    slug: z.ZodString;
    icon: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    parent: z.ZodOptional<z.ZodObject<{
        categoryId: z.ZodString;
        parentId: z.ZodNullable<z.ZodString>;
        name: z.ZodString;
        slug: z.ZodString;
        icon: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const categoryTreeNodeSchema: z.ZodObject<{
    categoryId: z.ZodString;
    parentId: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    slug: z.ZodString;
    icon: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    childrens: z.ZodArray<z.ZodAny>;
}, z.core.$strip>;
export declare const categoryTreeResponseSchema: z.ZodArray<z.ZodObject<{
    categoryId: z.ZodString;
    parentId: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    slug: z.ZodString;
    icon: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    childrens: z.ZodArray<z.ZodAny>;
}, z.core.$strip>>;
