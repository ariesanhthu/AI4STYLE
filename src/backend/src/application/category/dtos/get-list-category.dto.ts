import { paginationCursorQuerySchema } from "@/shared/dtos";
import z from "zod";

export const getListCategorySchema = paginationCursorQuerySchema.extend({
  search: z.string().optional(),
});

export type GetListCategoryDto = z.infer<typeof getListCategorySchema>