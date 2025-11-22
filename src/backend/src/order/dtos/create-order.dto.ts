import z from 'zod';

// Order Detail Create Schema (nested in Order)
export const createOrderDetailSchema = z.object({
  variantId: z
    .string({ error: 'Variant ID must be a string' }),

  quantity: z
    .number({ error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
});

export type CreateOrderDetailDto = z.infer<typeof createOrderDetailSchema>;

// Order Create Schema
export const createOrderSchema = z.object({
  recipientName: z
    .string({ error: 'Recipient name must be a string' })
    .min(1, 'Recipient name cannot be empty')
    .max(255, 'Recipient name must be less than 255 characters')
    .trim(),

  phoneNumber: z
    .string({ error: 'Phone number must be a string' })
    .regex(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits')
    .trim(),

  shippingAddress: z
    .string({ error: 'Shipping address must be a string' })
    .min(1, 'Shipping address cannot be empty')
    .max(500, 'Shipping address must be less than 500 characters')
    .trim(),

  email: z
    .string()
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .nullable()
    .optional(),

  orderDetails: z
    .array(createOrderDetailSchema)
    .min(1, 'Order must have at least one item'),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
