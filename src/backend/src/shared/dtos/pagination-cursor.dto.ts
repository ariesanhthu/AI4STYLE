import { ESortOrder } from '../enums';
import z from 'zod';

export const paginationCursorQuerySchema = z.object({
  cursor: z.string().nullable().default(null).optional(),

  // limit: z.number().optional().default(10),
  limit: z.coerce.number().default(10).optional(),

  sortOrder: z.enum(ESortOrder).default(ESortOrder.DESC).optional(),
});

export type PaginationCursorQueryDto = z.infer<
  typeof paginationCursorQuerySchema
>;

export const paginationCursorResponseSchema = z.object({
  items: z.array(z.any()),
  nextCursor: z.string().nullable(),
});

export type PaginationCursorResponseDto = z.infer<
  typeof paginationCursorResponseSchema
>;

/**
 * Helper function to create a typed pagination cursor response schema
 */
export const createPaginationCursorResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable(),
  });
