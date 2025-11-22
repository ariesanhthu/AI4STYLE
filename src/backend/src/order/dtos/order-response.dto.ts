import z from 'zod';
import { EOrderStatus } from '../enums';

// Order Detail Response Schema
const orderDetailResponseSchema = z.object({
  orderDetailId: z.string(),
  orderId: z.string(),
  variantId: z.string(),
  quantity: z.number(),
  pricePerUnit: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Order Response Schema
export const orderResponseSchema = z.object({
  orderId: z.string(),
  userId: z.string(),
  orderCode: z.string(),
  totalPrice: z.number(),
  status: z.enum(EOrderStatus),
  recipientName: z.string(),
  phoneNumber: z.string(),
  shippingAddress: z.string(),
  email: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  orderDetails: z.array(orderDetailResponseSchema).optional(),
});

export type OrderResponseDto = z.infer<typeof orderResponseSchema>;
