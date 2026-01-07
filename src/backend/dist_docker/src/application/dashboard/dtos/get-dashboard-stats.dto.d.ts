import { z } from 'zod';
export declare const getDashboardStatsSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    groupBy: z.ZodEnum<{
        day: "day";
        month: "month";
    }>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const getDashboardStatsSchemaTransform: z.ZodPipe<z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    groupBy: z.ZodEnum<{
        day: "day";
        month: "month";
    }>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>, z.ZodTransform<{
    startDate: Date | undefined;
    endDate: Date | undefined;
    groupBy: "day" | "month";
    year?: number | undefined;
}, {
    groupBy: "day" | "month";
    startDate?: string | undefined;
    endDate?: string | undefined;
    year?: number | undefined;
}>>;
export type GetDashboardStatsDto = z.infer<typeof getDashboardStatsSchemaTransform>;
export {};
