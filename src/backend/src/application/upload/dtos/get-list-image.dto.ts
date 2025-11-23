import { paginationCursorQuerySchema } from '@/shared/dtos';
import z from 'zod';

export const getListImageSchema = paginationCursorQuerySchema;

export type GetListImageDto = z.infer<typeof getListImageSchema>;
