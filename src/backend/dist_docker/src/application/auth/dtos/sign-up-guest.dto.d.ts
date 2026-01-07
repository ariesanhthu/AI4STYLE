import z from 'zod';
export declare const signUpGuestSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export type SignUpGuestDto = z.infer<typeof signUpGuestSchema>;
