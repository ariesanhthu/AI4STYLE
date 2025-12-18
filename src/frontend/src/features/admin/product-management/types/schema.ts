import { z } from "zod";

export const optionSchema = z.object({
  size: z.string().min(1, "Size is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be positive"),
  salePrice: z.number().min(0, "Sale price must be positive").nullable().optional(),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
}).refine((data) => {
  if (data.salePrice && data.price) {
    return data.price >= data.salePrice;
  }
  return true;
}, {
  message: "Original price must be greater than or equal to sale price",
  path: ["salePrice"],
});

export const variantSchema = z.object({
  variantName: z.string().min(1, "Variant name is required"),
  images: z.array(z.string()).optional(),
  attributes: z.object({
    colorFamily: z.string().optional(),
  }).optional(),
  options: z.array(optionSchema).min(1, "At least one option is required"),
});

export const productSchema = z.object({
  product: z.object({
    name: z.string().min(1, "Product name is required"),
    categoryId: z.string().min(1, "Category is required"),
    options: z.array(variantSchema),
  }),
});

export type ProductFormValues = z.infer<typeof productSchema>;
