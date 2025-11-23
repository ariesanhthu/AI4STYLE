import { EPaymentMethod } from '@/core/payment-method/enums';
import { EPaymentStatus, ETransactionType } from '@/core/payment/enums';
import z from 'zod';

// Payment Transaction Response Schema
const paymentTransactionResponseSchema = z.object({
  transactionId: z.string(),
  paymentId: z.string(),
  requestBody: z.string(),
  responseBody: z.string(),
  type: z.enum(ETransactionType),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Payment Response Schema
export const paymentResponseSchema = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  paymentMethodId: z.string(),
  type: z.enum(EPaymentMethod),
  status: z.enum(EPaymentStatus),
  createdAt: z.string(),
  updatedAt: z.string(),
  transactions: z
    .array(paymentTransactionResponseSchema)
    .optional()
    .nullable()
    .default(null),
});

export type PaymentResponseDto = z.infer<typeof paymentResponseSchema>;
