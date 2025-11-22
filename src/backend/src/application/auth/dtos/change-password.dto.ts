import z from 'zod';

export const changePasswordSchema = z.object({
  email: z.email('Invalid email address'),
  oldPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
