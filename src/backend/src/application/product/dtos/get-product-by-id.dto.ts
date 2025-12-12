import z from 'zod';

/**
 * Query schema for getting a product by ID
 * Supports optional inclusion of options and variants
 */
export const getProductByIdQuerySchema = z.object({
  includeOptions: z.coerce.boolean().optional(),

  includeVariants: z.coerce.boolean().optional(),
});

export type GetProductByIdQueryDto = z.infer<typeof getProductByIdQuerySchema>;
