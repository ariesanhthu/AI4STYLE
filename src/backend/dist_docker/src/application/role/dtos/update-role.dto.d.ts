import { EPermission } from '@/shared/enums';
import z from 'zod';
export declare const updateRoleSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodEnum<typeof EPermission>>>;
}, z.core.$strip>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
