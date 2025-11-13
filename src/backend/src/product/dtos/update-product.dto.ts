import { z } from 'zod';
import { optionSchema } from './create-product.dto';

// Schema for updating existing options (all fields optional + optionId required)
const updateOptionSchema = z.object({
  optionId: z.string('Invalid option ID'),
  name: z.string().min(1).max(255).optional(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Invalid hex color format')
    .optional(),
  colorFamily: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Invalid hex color format')
    .optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional(),
  images: z.array(z.string('Invalid image URL')).optional(),
  isShow: z.boolean().optional(),
});

// Update product schema (general information)
export const updateProductSchema = z.object({
  // Root product fields
  categoryId: z.string('Invalid category ID').optional(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),

  // Update existing options
  options: z.array(updateOptionSchema).optional(),

  // Add new options (reuse optionSchema from create-product)
  newOptions: z.array(optionSchema).optional(),

  // Delete options by ID
  deleteOptionIds: z.array(z.string()).optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type UpdateOptionInput = z.infer<typeof updateOptionSchema>;
