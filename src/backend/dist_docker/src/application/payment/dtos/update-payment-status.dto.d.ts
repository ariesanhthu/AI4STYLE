import { EPaymentStatus } from '@/core/payment/enums';
import z from 'zod';
export declare const updatePaymentStatusSchema: z.ZodObject<{
    status: z.ZodEnum<typeof EPaymentStatus>;
}, z.core.$strip>;
export type UpdatePaymentStatusDto = z.infer<typeof updatePaymentStatusSchema>;
