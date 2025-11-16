import z from "zod";

export const testBodyDto = z.object({
  message: z.string().min(1).max(255),
});

export type TestBodyDto = z.infer<typeof testBodyDto>;

export const testParamsDto = z.uuid();

export type TestParamsDto = z.infer<typeof testParamsDto>;

export const testQueryDto = z.object({
  verbose: z.coerce.boolean().optional(),
});

export type TestQueryDto = z.infer<typeof testQueryDto>;