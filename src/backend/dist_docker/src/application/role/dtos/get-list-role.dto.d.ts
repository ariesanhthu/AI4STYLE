import z from 'zod';
import { EUserType } from '@/shared/enums';
export declare const getListRoleSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodEnum<typeof import("@/shared/enums").ESortOrder>>>;
    type: z.ZodOptional<z.ZodEnum<typeof EUserType>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetListRoleDto = z.infer<typeof getListRoleSchema>;
