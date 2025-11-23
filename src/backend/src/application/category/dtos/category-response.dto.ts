import z from 'zod';

// Base category response schema
const baseCategoryResponseSchema = z.object({
  categoryId: z.string(),
  parentId: z.string().nullable(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const categoryResponseSchema = baseCategoryResponseSchema.extend({
  parent: baseCategoryResponseSchema.optional(),
});

export const categoryTreeNodeSchema = baseCategoryResponseSchema.extend({
  childrens: z.array(z.any()),
});

export const categoryTreeResponseSchema = z.array(categoryTreeNodeSchema);
