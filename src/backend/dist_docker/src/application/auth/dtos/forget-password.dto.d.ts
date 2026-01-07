import z from 'zod';
export declare const forgetPasswordSchema: z.ZodObject<{
    email: z.ZodEmail;
    otp: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type ForgetPasswordDto = z.infer<typeof forgetPasswordSchema>;
