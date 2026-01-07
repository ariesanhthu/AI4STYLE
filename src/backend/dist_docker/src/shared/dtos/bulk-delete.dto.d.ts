import z from 'zod';
export declare const bulkDeleteSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type BulkDeleteDto = z.infer<typeof bulkDeleteSchema>;
