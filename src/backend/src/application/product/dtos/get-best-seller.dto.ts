import { z } from 'zod';
import { paginationCursorQuerySchema } from '@/shared/dtos/pagination-cursor.dto';

export const getBestSellerSchema = paginationCursorQuerySchema.omit({
  sortOrder: true,
});

export type GetBestSellerDto = z.infer<typeof getBestSellerSchema>;
