import { z } from 'zod';
import { productOptionResponseSchema } from './product-response.dto';

export const productOptionBestSellerSchema = productOptionResponseSchema.extend({
  totalSold: z.number(),
});

export type ProductOptionBestSellerDto = z.infer<
  typeof productOptionBestSellerSchema
>;
