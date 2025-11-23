import z from 'zod';

// Payment Status Update Schema
export const refundPaymentStatusSchema = z.object({
  amount: z.number().min(0, 'Refund amount must be non-negative'),
  requestBy: z.string().min(1, 'RequestBy is required'),
});

export type RefundPaymentStatusDto = z.infer<typeof refundPaymentStatusSchema>;
