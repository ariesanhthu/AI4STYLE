import z from 'zod';
import { EPaymentMethod } from '../enums';

// Payment Method Response Schema
export const paymentMethodResponseSchema = z.object({
  paymentMethodId: z.string(),
  displayName: z.string(),
  type: z.enum(EPaymentMethod),
  icon: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PaymentMethodResponseDto = z.infer<typeof paymentMethodResponseSchema>;
