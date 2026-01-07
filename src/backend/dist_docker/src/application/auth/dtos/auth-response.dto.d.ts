import z from 'zod';
export declare const booleanResponseSchema: z.ZodBoolean;
export declare const otpResponseSchema: z.ZodObject<{
    otp: z.ZodOptional<z.ZodString>;
    success: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const tokenResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;
