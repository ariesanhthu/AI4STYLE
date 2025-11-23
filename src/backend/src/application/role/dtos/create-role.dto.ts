import { EPermission } from '@/shared/enums';
import z from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string({ error: 'Name must be a string' })
    .min(1, 'Name cannot be empty')
    .max(50, 'Name must be less than 50 characters')
    .trim(),

  description: z
    .string({
      error: 'Description must be a string',
    })
    .max(255, 'Description must be less than 255 characters')
    .trim()
    .default('')
    .optional(),

  // type: z
  //   .enum(EUserType, {error: 'Invalid type'}),

  permissions: z.array(z.enum(EPermission, { error: 'Invalid permission' }), {
    error: 'Permissions must be an array',
  }),
});

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
