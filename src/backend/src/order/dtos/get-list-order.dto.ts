import z from "zod";
import { paginationCursorQuerySchema } from "../../shared/dtos";
import { EOrderStatus } from "../enums";

export const getListOfOrdersQuerySchema = paginationCursorQuerySchema.extend({
  customerId: z.string().optional(),
  status: z.enum(EOrderStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetListOfOrdersQueryDto = z.infer<typeof getListOfOrdersQuerySchema>;