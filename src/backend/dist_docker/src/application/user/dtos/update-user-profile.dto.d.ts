import { EGender } from '@/core/user/enums';
import z from 'zod';
export declare const updateUserProfileSchema: z.ZodObject<{
    gender: z.ZodOptional<z.ZodEnum<typeof EGender>>;
    phone: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    birthdate: z.ZodOptional<z.ZodISODateTime>;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;
