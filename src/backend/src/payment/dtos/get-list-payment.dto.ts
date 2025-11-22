import z from 'zod';
import { paginationCursorQuerySchema } from '../../shared/dtos';
import { EPaymentStatus } from '../enums';
import { EPaymentMethod } from '../../payment-method/enums';

export const getListOfPaymentsQuerySchema = paginationCursorQuerySchema.extend({
  status: z.enum(EPaymentStatus).optional(),
  type: z.enum(EPaymentMethod).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetListOfPaymentsQueryDto = z.infer<
  typeof getListOfPaymentsQuerySchema
>;
