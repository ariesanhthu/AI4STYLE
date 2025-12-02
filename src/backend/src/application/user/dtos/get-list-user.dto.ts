import { paginationCursorQuerySchema } from '@/shared/dtos';
import { EUserType } from '@/shared/enums';
import z from 'zod';

export const getListUserSchema = paginationCursorQuerySchema.extend({
  type: z.enum(EUserType).optional(),
  roleId: z.string('roleId must be a string').optional(),
});

export type GetListUserDto = z.infer<typeof getListUserSchema>;
