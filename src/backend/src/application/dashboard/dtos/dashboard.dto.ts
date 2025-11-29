import z from "zod";

export const dashboardItemSchema = z.object({
  x: z.string(),
  y: z.number(),
});

export type DashboardItemDto = z.infer<typeof dashboardItemSchema>;

export const dashboardSchema = z.object({
  data: z.array(dashboardItemSchema),
  xLabel: z.string(),
  yLabel: z.string(),
  xType: z.string(),
  yType: z.string(),
});

export type DashboardDto = z.infer<typeof dashboardSchema>;