import { z } from 'zod';

export const getDashboardStatsSchema = z.object({
  startDate: z.string().transform((str) => new Date(str)).optional(),
  endDate: z.string().transform((str) => new Date(str)).optional(),
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
});

export type GetDashboardStatsDto = z.infer<typeof getDashboardStatsSchema>;
