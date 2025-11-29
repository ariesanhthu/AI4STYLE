import { paginationCursorQuerySchema } from "@/shared/dtos";
import z from "zod";

export const getListCategorySchema = paginationCursorQuerySchema

export type GetListCategoryDto = z.infer<typeof getListCategorySchema>