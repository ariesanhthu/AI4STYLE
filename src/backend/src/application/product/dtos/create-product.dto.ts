import { z } from 'zod';

// Variant schema (reusable)
export const variantSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(50),
  size: z.string().min(1, 'Size is required').max(20),
  price: z.number().int().min(0, 'Price must be non-negative'),
  newPrice: z.number().int().min(0).optional().nullable(),
  stockQuantity: z
    .number()
    .int()
    .min(0, 'Stock quantity must be non-negative')
    .default(0),
});

// Option schema (reusable)
export const optionSchema = z.object({
  name: z.string().min(1, 'Option name is required').max(255),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Invalid hex color format'),
  colorFamily: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Invalid hex color format'),
  thumbnail: z.string('Invalid thumbnail URL'),
  images: z
    .array(z.string('Invalid image URL'))
    .min(1, 'At least one image is required'),
  isShow: z.boolean().default(true),
  variants: z
    .array(variantSchema)
    .min(1, 'At least one variant is required for each option'),
});

// Create product schema
export const createProductSchema = z.object({
  categoryId: z.string('Invalid category ID'),
  name: z.string().min(1, 'Product name is required').max(255),
  description: z.string().max(2000).optional(),
  options: z
    .array(optionSchema)
    .min(1, 'At least one option (color variant) is required'),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type ProductOptionInput = z.infer<typeof optionSchema>;
export type ProductVariantInput = z.infer<typeof variantSchema>;
