import { EPaymentStatus } from '@/core/payment/enums';
import z from 'zod';

// Payment Status Update Schema
export const updatePaymentStatusSchema = z.object({
  status: z.enum(EPaymentStatus, {
    error: 'Payment status must be a valid status',
  }),
});

export type UpdatePaymentStatusDto = z.infer<typeof updatePaymentStatusSchema>;
