import z from 'zod';
export declare const refundPaymentStatusSchema: z.ZodObject<{
    amount: z.ZodNumber;
    requestBy: z.ZodString;
}, z.core.$strip>;
export type RefundPaymentStatusDto = z.infer<typeof refundPaymentStatusSchema>;
