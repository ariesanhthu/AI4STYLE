import z from "zod";
import { paginationCursorQuerySchema } from "../../shared/dtos";

export const getListUserSchema = paginationCursorQuerySchema.extend({
  roleId: z
    .string('roleId must be a string')
    .optional(),
});

export type GetListUserDto = z.infer<typeof getListUserSchema>;