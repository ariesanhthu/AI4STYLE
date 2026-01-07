import z from "zod";
export declare const dashboardItemSchema: z.ZodObject<{
    x: z.ZodString;
    y: z.ZodNumber;
}, z.core.$strip>;
export type DashboardItemDto = z.infer<typeof dashboardItemSchema>;
export declare const dashboardSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        x: z.ZodString;
        y: z.ZodNumber;
    }, z.core.$strip>>;
    xLabel: z.ZodString;
    yLabel: z.ZodString;
    xType: z.ZodString;
    yType: z.ZodString;
}, z.core.$strip>;
export type DashboardDto = z.infer<typeof dashboardSchema>;
