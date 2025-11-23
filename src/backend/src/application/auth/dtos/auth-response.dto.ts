import z from 'zod';

// Simple boolean response for sign-out, change-password, forget-password, verify-otp, sign-up endpoints
export const booleanResponseSchema = z.boolean();

// OTP response for request-otp endpoint
export const otpResponseSchema = z.object({
  otp: z.string().optional(),
  success: z.boolean().optional(),
});

// Token response for refresh-token and sign-in endpoint
export const tokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
