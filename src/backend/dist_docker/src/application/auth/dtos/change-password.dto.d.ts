import z from 'zod';
export declare const changePasswordSchema: z.ZodObject<{
    email: z.ZodEmail;
    oldPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
