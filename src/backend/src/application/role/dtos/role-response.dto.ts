import { EPermission, EUserType } from '@/shared/enums';
import z from 'zod';

export const roleResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(EUserType),
  permissions: z.array(z.enum(EPermission)),
  createdAt: z.string(),
  updatedAt: z.string(),
});
