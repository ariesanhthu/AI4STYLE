import { EOrderStatus } from '@/core/order/enums';
import z from 'zod';
export declare const orderResponseSchema: z.ZodObject<{
    orderId: z.ZodString;
    userId: z.ZodString;
    orderCode: z.ZodString;
    totalPrice: z.ZodNumber;
    status: z.ZodEnum<typeof EOrderStatus>;
    recipientName: z.ZodString;
    phoneNumber: z.ZodString;
    shippingAddress: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    orderDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
        orderDetailId: z.ZodString;
        orderId: z.ZodString;
        variantId: z.ZodString;
        quantity: z.ZodNumber;
        pricePerUnit: z.ZodNumber;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type OrderResponseDto = z.infer<typeof orderResponseSchema>;
export declare const orderResponseDetailDtoSchema: z.ZodObject<{
    status: z.ZodEnum<typeof EOrderStatus>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    recipientName: z.ZodString;
    phoneNumber: z.ZodString;
    shippingAddress: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    orderId: z.ZodString;
    userId: z.ZodString;
    orderCode: z.ZodString;
    totalPrice: z.ZodNumber;
    orderDetails: z.ZodArray<z.ZodObject<{
        orderDetailId: z.ZodString;
        orderId: z.ZodString;
        variantId: z.ZodString;
        quantity: z.ZodNumber;
        pricePerUnit: z.ZodNumber;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        variant: z.ZodObject<{
            sku: z.ZodString;
            size: z.ZodString;
            name: z.ZodString;
            color: z.ZodString;
            thumbnail: z.ZodString;
            optionId: z.ZodString;
            slug: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type OrderResponseDetailDto = z.infer<typeof orderResponseDetailDtoSchema>;
