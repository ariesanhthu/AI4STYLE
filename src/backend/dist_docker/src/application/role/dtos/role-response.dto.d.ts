import { EPermission, EUserType } from '@/shared/enums';
import z from 'zod';
export declare const roleResponse: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    type: z.ZodEnum<typeof EUserType>;
    permissions: z.ZodArray<z.ZodEnum<typeof EPermission>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
