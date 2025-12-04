import z from 'zod';
import { EUserType } from '@/shared/enums';
import { paginationCursorQuerySchema } from '@/shared/dtos';

export const getListRoleSchema = paginationCursorQuerySchema.extend({
  type: z.enum(EUserType, { error: 'Invalid type' }).optional(),
  search: z.string().optional(),
});

export type GetListRoleDto = z.infer<typeof getListRoleSchema>;
