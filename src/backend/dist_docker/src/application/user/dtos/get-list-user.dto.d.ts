import { EUserType } from '@/shared/enums';
import z from 'zod';
export declare const getListUserSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodEnum<typeof import("@/shared/enums").ESortOrder>>>;
    type: z.ZodOptional<z.ZodEnum<typeof EUserType>>;
    roleId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetListUserDto = z.infer<typeof getListUserSchema>;
