import z from "zod";
import { paginationCursorQuerySchema } from "../../shared/dtos";

export const getListImageSchema = paginationCursorQuerySchema;

export type GetListImageDto = z.infer<typeof getListImageSchema>;
