import { z } from 'zod';
export declare const exportDashboardReportSchema: z.ZodObject<{
    type: z.ZodEnum<{
        month: "month";
        year: "year";
    }>;
    value: z.ZodCoercedNumber<unknown>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type ExportDashboardReportDto = z.infer<typeof exportDashboardReportSchema>;
