import { EPermission } from "@/shared/enums";
import { z } from "zod";

export const permissionResponseSchema = z.object({
  permissions: z.array(z.enum(EPermission))  
})

export type PermissionResponseDto = z.infer<typeof permissionResponseSchema>
