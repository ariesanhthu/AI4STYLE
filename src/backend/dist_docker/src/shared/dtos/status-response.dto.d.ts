import z from 'zod';
export declare const statusResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
}, z.core.$strip>;
export type StatusResponseDto = z.infer<typeof statusResponseSchema>;
