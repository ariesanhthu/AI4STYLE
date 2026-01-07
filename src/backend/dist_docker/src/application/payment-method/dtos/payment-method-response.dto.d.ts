import { EPaymentMethod } from '@/core/payment-method/enums';
import z from 'zod';
export declare const paymentMethodResponseSchema: z.ZodObject<{
    paymentMethodId: z.ZodString;
    displayName: z.ZodString;
    type: z.ZodEnum<typeof EPaymentMethod>;
    icon: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type PaymentMethodResponseDto = z.infer<typeof paymentMethodResponseSchema>;
