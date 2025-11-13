import z from "zod";
import { paginationCursorQuerySchema } from "../../shared/dtos";

export const getListProductSchema = paginationCursorQuerySchema.extend({
  category_id:  z.string().optional(),
  is_show:      z.boolean().optional(),
  color_family: z.string().optional(),
  min_price:    z.number().min(0).optional(),
  max_price:    z.number().min(0).optional(),
  search:       z.string().min(1).optional(),
});

export type GetListProductDto = z.infer<typeof getListProductSchema>;

export const getListProductClientSchema = paginationCursorQuerySchema.extend({
  category_id:  z.string().optional(),
  color_family: z.string().optional(),
  min_price:    z.number().min(0).optional(),
  max_price:    z.number().min(0).optional(),
  search:       z.string().min(1).optional(),
});

export type GetListProductClientDto = z.infer<typeof getListProductClientSchema>;