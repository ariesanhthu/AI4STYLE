import { EGender } from '@/core/user/enums';
import { EPermission, EUserType } from '@/shared/enums';
import z from 'zod';
export declare const userResponseSchema: z.ZodObject<{
    id: z.ZodString;
    roleId: z.ZodString;
    role: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        type: z.ZodEnum<typeof EUserType>;
        permissions: z.ZodArray<z.ZodEnum<typeof EPermission>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    gender: z.ZodEnum<typeof EGender>;
    avatar: z.ZodString;
    birthdate: z.ZodString;
    address: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
