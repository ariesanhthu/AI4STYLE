import { variantSchema } from '@/application/product/dtos';
import { EOrderStatus } from '@/core/order/enums';
import z from 'zod';

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

export const orderResponseDetailDtoSchema = orderResponseSchema
  .omit({
    orderDetails: true,
  })
  .extend({
    orderDetails: z.array(orderDetailResponseSchema.extend({
      variant: variantSchema.pick({
        sku: true,
        size: true
      }).extend({
        name: z.string(),
        color: z.string(),
        thumbnail: z.string(), 
        optionId: z.string(),
        slug: z.string(),
      }),
    })),
  });

export type OrderResponseDetailDto = z.infer<typeof orderResponseDetailDtoSchema>;
