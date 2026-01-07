import z from 'zod';
export declare const successResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    code: z.ZodNumber;
    timestamp: z.ZodString;
}, z.core.$strip>;
export declare const successResponseSchemaTemplate: z.ZodObject<{
    success: z.ZodBoolean;
    code: z.ZodNumber;
    timestamp: z.ZodString;
    data: z.ZodAny;
}, z.core.$strip>;
export type SuccessResponseDto = z.infer<typeof successResponseSchemaTemplate>;
export declare const errorResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    code: z.ZodNumber;
    error: z.ZodAny;
    message: z.ZodString;
    timestamp: z.ZodString;
}, z.core.$strip>;
export type ErrorResponseDto = z.infer<typeof errorResponseSchema>;
