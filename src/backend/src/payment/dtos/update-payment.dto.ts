import z from 'zod';

// Payment Update Schema (exclude status)
export const updatePaymentSchema = z.object({
  paymentMethodId: z
    .string('Payment method ID must be a string')
});

export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema>;
