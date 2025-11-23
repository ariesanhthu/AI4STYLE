import z from 'zod';
import { EPaymentStatus } from '@/core/payment/enums';
import { EPaymentMethod } from '@/core/payment-method/enums';
import { paginationCursorQuerySchema } from '@/shared/dtos';

export const getListOfPaymentsQuerySchema = paginationCursorQuerySchema.extend({
  status: z.enum(EPaymentStatus).optional(),
  type: z.enum(EPaymentMethod).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetListOfPaymentsQueryDto = z.infer<
  typeof getListOfPaymentsQuerySchema
>;
