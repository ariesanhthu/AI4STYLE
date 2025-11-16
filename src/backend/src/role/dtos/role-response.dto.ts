import z from "zod";
import { EPermission, EUserType } from "../../shared/enums";

export const roleResponse = z.object({
  roleId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(EUserType),
  permissions: z.array(z.enum(EPermission)),
  createdAt: z.string(),
  updatedAt: z.string(),
});