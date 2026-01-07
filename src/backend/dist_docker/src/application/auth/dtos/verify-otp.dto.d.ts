import z from 'zod';
export declare const verifyOtpSchema: z.ZodObject<{
    email: z.ZodEmail;
    otp: z.ZodString;
}, z.core.$strip>;
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
