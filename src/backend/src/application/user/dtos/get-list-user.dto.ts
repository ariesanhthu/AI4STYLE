import { paginationCursorQuerySchema } from '@/shared/dtos';
import z from 'zod';

export const getListUserSchema = paginationCursorQuerySchema.extend({
  roleId: z.string('roleId must be a string').optional(),
});

export type GetListUserDto = z.infer<typeof getListUserSchema>;
