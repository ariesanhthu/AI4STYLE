import z from 'zod';
import { EOrderStatus } from '../enums';

export const updateOrderStatusSchema = z.object({
  status: z.enum(EOrderStatus, {
    error: 'Status must be a valid order status',
  }),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
