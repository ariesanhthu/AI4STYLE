import z from 'zod';
import { EOrderStatus } from '@/core/order/enums';
import { paginationCursorQuerySchema } from '@/shared/dtos';

export const getListOfOrdersQuerySchema = paginationCursorQuerySchema.extend({
  customerId: z.string().optional(),
  status: z.enum(EOrderStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetListOfOrdersQueryDto = z.infer<
  typeof getListOfOrdersQuerySchema
>;
