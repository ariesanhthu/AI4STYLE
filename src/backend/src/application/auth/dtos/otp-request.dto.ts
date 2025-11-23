import { EOtpType } from '@/core/auth/enums';
import z from 'zod';

export const otpRequestSchema = z.object({
  email: z.email('Invalid email address'),
  type: z.enum(EOtpType),
});

export type OtpRequestDto = z.infer<typeof otpRequestSchema>;
