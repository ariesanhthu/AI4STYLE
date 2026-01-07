import z from 'zod';
export declare const updatePaymentSchema: z.ZodObject<{
    paymentMethodId: z.ZodString;
}, z.core.$strip>;
export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema>;
