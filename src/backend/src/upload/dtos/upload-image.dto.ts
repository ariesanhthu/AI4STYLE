import z from "zod";

export const uploadImageSchema = z.object({
  title: z
    .string({ error: 'Title must be a string' })
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  
  file: z
    .any()
    .refine((file) => file !== undefined && file !== null, {
      message: 'File is required',
    }),
});

export type UploadImageDto = z.infer<typeof uploadImageSchema>;
