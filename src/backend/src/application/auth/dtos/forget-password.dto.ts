import z from 'zod';

export const forgetPasswordSchema = z.object({
  email: z.email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 characters long'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type ForgetPasswordDto = z.infer<typeof forgetPasswordSchema>;
