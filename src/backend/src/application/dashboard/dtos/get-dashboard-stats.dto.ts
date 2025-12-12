import { z } from 'zod';

export const getDashboardStatsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  groupBy: z.enum(['day', 'month']),
  year: z.coerce.number().optional(),
}).refine((data) => {
  if (data.groupBy === 'month' && !data.year) {
    return false;
  }
  return true;
}, {
  message: "Year is required when groupBy is 'month'",
  path: ['year'],
})

const getDashboardStatsSchemaTransform = getDashboardStatsSchema.transform((data) => {
  return {
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  };
})

export type GetDashboardStatsDto = z.infer<typeof getDashboardStatsSchemaTransform>;
