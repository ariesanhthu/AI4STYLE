import { EGender } from '@/core/user/enums';
import { EPermission, EUserType } from '@/shared/enums';
import z from 'zod';

// User response schema based on UserEntity.toJSON()
export const userResponseSchema = z.object({
  id: z.string(),
  roleId: z.string(),
  role: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      type: z.enum(EUserType),
      permissions: z.array(z.enum(EPermission)),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  gender: z.enum(EGender),
  avatar: z.string(),
  birthdate: z.string(),
  address: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
