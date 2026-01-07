import { EPermission } from '@/shared/enums';
import z from 'zod';
export declare const createRoleSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    permissions: z.ZodArray<z.ZodEnum<typeof EPermission>>;
}, z.core.$strip>;
export type CreateRoleDto = z.infer<typeof createRoleSchema>;
