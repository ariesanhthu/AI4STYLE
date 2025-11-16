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

export const paginationCursorResponseSchema = z.object({
  items: z.array(z.any()),
  nextCursor: z.string().nullable(),
});

export type PaginationCursorResponseDto = z.infer<typeof paginationCursorResponseSchema>;

/**
 * Helper function to create a typed pagination cursor response schema
 */
export const createPaginationCursorResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable(),
  });