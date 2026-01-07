import z from 'zod';
export declare const createOrderDetailSchema: z.ZodObject<{
    variantId: z.ZodString;
    quantity: z.ZodNumber;
}, z.core.$strip>;
export type CreateOrderDetailDto = z.infer<typeof createOrderDetailSchema>;
export declare const createOrderSchema: z.ZodObject<{
    recipientName: z.ZodString;
    phoneNumber: z.ZodString;
    shippingAddress: z.ZodString;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    orderDetails: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        quantity: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateOrderDto = z.infer<typeof createOrderSchema>;
