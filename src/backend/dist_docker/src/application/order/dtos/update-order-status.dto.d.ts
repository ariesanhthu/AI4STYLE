import { EOrderStatus } from '@/core/order/enums';
import z from 'zod';
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<typeof EOrderStatus>;
}, z.core.$strip>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
