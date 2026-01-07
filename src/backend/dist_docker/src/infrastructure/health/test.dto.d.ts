import z from 'zod';
export declare const testBodyDto: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
export type TestBodyDto = z.infer<typeof testBodyDto>;
export declare const testParamsDto: z.ZodUUID;
export type TestParamsDto = z.infer<typeof testParamsDto>;
export declare const testQueryDto: z.ZodObject<{
    verbose: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
export type TestQueryDto = z.infer<typeof testQueryDto>;
