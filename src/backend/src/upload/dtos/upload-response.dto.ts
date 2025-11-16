import z from "zod";

// Image response schema based on ImageEntity.toJSON()
export const imageResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  format: z.string(),
  size: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Array response for bulk upload
export const imageArrayResponseSchema = z.array(imageResponseSchema);
