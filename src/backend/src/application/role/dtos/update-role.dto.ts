import { EPermission } from '@/shared/enums';
import z from 'zod';

export const updateRoleSchema = z
  .object({
    name: z
      .string({
        error: 'Name must be a string',
      })
      .min(1, 'Name cannot be empty')
      .max(50, 'Name must be less than 50 characters')
      .trim()
      .optional(),

    description: z
      .string({
        error: 'Description must be a string',
      })
      .max(255, 'Description must be less than 255 characters')
      .trim()
      .optional(),

    permissions: z
      .array(z.enum(EPermission, { error: 'Invalid permission' }), {
        error: 'Permissions must be an array',
      })
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided for update',
  );

export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
