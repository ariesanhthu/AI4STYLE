import z from 'zod';
import { EPaymentStatus } from '@/core/payment/enums';
import { EPaymentMethod } from '@/core/payment-method/enums';
export declare const getListOfPaymentsQuerySchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodEnum<typeof import("../../../shared/enums").ESortOrder>>>;
    status: z.ZodOptional<z.ZodEnum<typeof EPaymentStatus>>;
    type: z.ZodOptional<z.ZodEnum<typeof EPaymentMethod>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetListOfPaymentsQueryDto = z.infer<typeof getListOfPaymentsQuerySchema>;
