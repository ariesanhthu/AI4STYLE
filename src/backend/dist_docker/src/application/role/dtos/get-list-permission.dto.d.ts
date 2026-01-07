import { EPermission } from "@/shared/enums";
import { z } from "zod";
export declare const permissionResponseSchema: z.ZodObject<{
    permissions: z.ZodArray<z.ZodEnum<typeof EPermission>>;
}, z.core.$strip>;
export type PermissionResponseDto = z.infer<typeof permissionResponseSchema>;
