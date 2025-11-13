import z from 'zod';

/**
 * Query schema for getting a product by ID
 * Supports optional inclusion of options and variants
 */
export const getProductByIdQuerySchema = z.object({
  includeOptions: z
    .preprocess((val) => {
      // Handle empty string or undefined
      if (val === '' || val === undefined) return undefined;
      // Handle string boolean values
      if (val === 'true' || val === '1') return true;
      if (val === 'false' || val === '0') return false;
      return val;
    }, z.boolean().optional()),

  includeVariants: z
    .preprocess((val) => {
      // Handle empty string or undefined
      if (val === '' || val === undefined) return undefined;
      // Handle string boolean values
      if (val === 'true' || val === '1') return true;
      if (val === 'false' || val === '0') return false;
      return val;
    }, z.boolean().optional()),
});

export type GetProductByIdQueryDto = z.infer<typeof getProductByIdQuerySchema>;
