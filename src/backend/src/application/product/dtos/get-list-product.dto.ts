import z from 'zod';
import { paginationCursorQuerySchema } from '@/shared/dtos';

export enum EProductSortOption {
  PRICE = 'price',
  TIME = 'time',
}

export const getListProductSchema = paginationCursorQuerySchema.extend({
  category_id: z.string().optional(),
  is_show: z.coerce.boolean().optional(),
  color_family: z.string().optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
});

export type GetListProductDto = z.infer<typeof getListProductSchema>;

export const getListProductClientSchema = paginationCursorQuerySchema.extend({
  category_id: z.string().optional(),
  color_family: z.string().optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
  sortOption: z.enum(EProductSortOption).optional(),
});

export type GetListProductClientDto = z.infer<
  typeof getListProductClientSchema
>;
