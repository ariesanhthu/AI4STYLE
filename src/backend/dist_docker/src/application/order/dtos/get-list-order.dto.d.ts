import z from 'zod';
import { EOrderStatus } from '@/core/order/enums';
export declare const getListOfOrdersQuerySchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodDefault<z.ZodNullable<z.ZodString>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodEnum<typeof import("../../../shared/enums").ESortOrder>>>;
    customerId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<typeof EOrderStatus>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetListOfOrdersQueryDto = z.infer<typeof getListOfOrdersQuerySchema>;
