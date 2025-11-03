import { ESortOrder } from "../enums";
import z from "zod";

export const paginationCursorQuerySchema = z.object({
  cursor: z
    .preprocess((val) => {
      if (val === "") return null;
      return val;
    }, z.string().nullable().default(null)),

  limit: z.coerce.number().optional().default(10),

  sortOrder: z
    .preprocess((val) => {
      if (val === '') {
        return undefined;
      }
    }, z.enum(ESortOrder).optional().default(ESortOrder.DESC)),
})

export type PaginationCursorQueryDto = z.infer<typeof paginationCursorQuerySchema>;