import z from 'zod';
export declare const uploadImageSchema: z.ZodObject<{
    title: z.ZodString;
    file: z.ZodAny;
}, z.core.$strip>;
export type UploadImageDto = z.infer<typeof uploadImageSchema>;
