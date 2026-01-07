import z from 'zod';
export declare const createPaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    paymentMethodId: z.ZodString;
}, z.core.$strip>;
export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
export declare const createPaymentResponseSchema: z.ZodObject<{
    payUrl: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type CreatePaymentResponseDto = z.infer<typeof createPaymentResponseSchema>;
