import { z } from "zod";

export const variantDetailSchema = z.object({
  size: z.string().min(1, "Size is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be positive"),
  newPrice: z.number().min(0, "New price must be positive").nullable().optional(),
  stockQuantity: z.number().int().min(0, "Stock quantity must be non-negative"),
}).refine((data) => {
  if (data.newPrice && data.price) {
    return data.price >= data.newPrice;
  }
  return true;
}, {
  message: "Original price must be greater than or equal to new price",
  path: ["newPrice"],
});

export const optionSchema = z.object({
  optionId: z.string().optional(),
  name: z.string().min(1, "Option name is required"),
  images: z.array(z.string()).nullish(),
  color: z.string().nullish(),
  colorFamily: z.string().nullish(),
  thumbnail: z.string().nullish(),
  isShow: z.boolean().optional(),
  price: z.number().min(0).optional().nullable(),
  newPrice: z.number().min(0).optional().nullable(),
  variants: z.array(variantDetailSchema).min(1, "At least one variant is required"),
});

export const productSchema = z.object({
  product: z.object({
    name: z.string().min(1, "Product name is required"),
    categoryId: z.string().min(1, "Category is required"),
    options: z.array(optionSchema),
  }),
});

export type ProductFormValues = z.infer<typeof productSchema>;
