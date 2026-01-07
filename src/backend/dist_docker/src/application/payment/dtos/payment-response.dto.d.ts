import { EPaymentMethod } from '@/core/payment-method/enums';
import { EPaymentStatus, ETransactionType } from '@/core/payment/enums';
import z from 'zod';
export declare const paymentResponseSchema: z.ZodObject<{
    paymentId: z.ZodString;
    orderId: z.ZodString;
    paymentMethodId: z.ZodString;
    type: z.ZodEnum<typeof EPaymentMethod>;
    status: z.ZodEnum<typeof EPaymentStatus>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    transactions: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        transactionId: z.ZodString;
        paymentId: z.ZodString;
        requestBody: z.ZodString;
        responseBody: z.ZodString;
        type: z.ZodEnum<typeof ETransactionType>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>>>>;
}, z.core.$strip>;
export type PaymentResponseDto = z.infer<typeof paymentResponseSchema>;
