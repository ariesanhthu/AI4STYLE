import z from 'zod';

// Payment Create Schema
export const createPaymentSchema = z.object({
  orderId: z
    .string({ error: 'Order ID must be a string' }),

  paymentMethodId: z
    .string({ error: 'Payment method ID must be a string' }),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;

export const createPaymentResponseSchema = z.object({
  payUrl: z.string().nullable(),
});

export type CreatePaymentResponseDto = z.infer<typeof createPaymentResponseSchema>;