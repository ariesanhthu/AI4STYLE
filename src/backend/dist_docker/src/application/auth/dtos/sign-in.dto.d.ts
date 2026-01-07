import z from 'zod';
export declare const signInSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type SignInDto = z.infer<typeof signInSchema>;
