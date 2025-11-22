import z from 'zod';

/**
 * Schema for updating a single product variant's stock and price
 */
export const updateVariantStockPriceSchema = z.object({
  variantId: z.string('Invalid variant ID format'),
  price: z.number().int().min(0, 'Price must be a non-negative integer').optional(),
  newPrice: z.number().int().min(0, 'New price must be a non-negative integer').nullable().optional(),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be a non-negative integer').optional(),
});

/**
 * Schema for bulk updating product variants' stock and prices
 */
export const updateProductStockPriceSchema = z.object({
  variants: z
    .array(updateVariantStockPriceSchema)
    .min(1, 'At least one variant must be provided'),
});

export type UpdateVariantStockPriceDto = z.infer<typeof updateVariantStockPriceSchema>;
export type UpdateProductStockPriceDto = z.infer<typeof updateProductStockPriceSchema>;


export const modifyProductVariantStockSchema = z.object({
  variants: z.array(z.object({
    variantId: z.string('Invalid variant ID format'),
    // Can be positive (increase stock) or negative (decrease stock)
    stockChange: z.number().int().refine((val) => val !== 0, {
      message: 'Quantity change must be a non-zero integer',
    }),
  })).min(1, 'At least one variant must be provided'),
});

export type ModifyProductVariantStockDto = z.infer<typeof modifyProductVariantStockSchema>;