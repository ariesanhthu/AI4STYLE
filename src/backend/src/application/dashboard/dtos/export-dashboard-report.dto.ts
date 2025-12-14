import { z } from 'zod';

export const exportDashboardReportSchema = z.object({
  type: z.enum(['year', 'month']),
  value: z.coerce.number().int().min(1),
  year: z.coerce.number().int().min(2000).optional(),
});

export type ExportDashboardReportDto = z.infer<typeof exportDashboardReportSchema>;
