import z from 'zod';
export declare const signUpStaffSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    name: z.ZodString;
    role_id: z.ZodString;
}, z.core.$strip>;
export type SignUpStaffDto = z.infer<typeof signUpStaffSchema>;
