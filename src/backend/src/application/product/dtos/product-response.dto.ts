import z from 'zod';

// Product Variant response schema based on ProductVariantEntity.toJSON()
export const productVariantResponseSchema = z.object({
  variantId: z.string(),
  optionId: z.string(),
  sku: z.string(),
  size: z.string(),
  price: z.number(),
  newPrice: z.number().nullable(),
  stockQuantity: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  hasDiscount: z.boolean(),
  discountPercentage: z.number().nullable(),
  inStock: z.boolean(),
  lowStock: z.boolean(),
});

// Product Option response schema based on ProductOptionEntity.toJSON()
export const productOptionResponseSchema = z.object({
  optionId: z.string(),
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  color: z.string(),
  colorFamily: z.string(),
  thumbnail: z.string().nullable(),
  images: z.array(z.string()),
  price: z.number(),
  newPrice: z.number().nullable(),
  outOfStock: z.boolean(),
  isShow: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  hasDiscount: z.boolean(),
  discountPercentage: z.number().nullable(),
  variants: z.array(productVariantResponseSchema).optional(),
  relatedOptions: z.array(z.object({
    optionId: z.string(),
    thumbnail: z.string()
  })).optional(),
});

export type ProductOptionResponseDto = z.infer<typeof productOptionResponseSchema>;

// Product response schema based on ProductEntity.toJSON()
export const productResponseSchema = z.object({
  productId: z.string(),
  categoryId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  thumbnail: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  options: z.array(productOptionResponseSchema).optional(),
});
