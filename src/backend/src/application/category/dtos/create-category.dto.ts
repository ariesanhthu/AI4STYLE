import z from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string({ error: 'Name must be a string' })
    .min(1, 'Name cannot be empty')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  slug: z
    .string({ error: 'Slug must be a string' })
    .min(1, 'Slug cannot be empty')
    .max(100, 'Slug must be less than 100 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be URL-friendly (lowercase letters, numbers, hyphens)',
    )
    .trim(),

  description: z
    .string({ error: 'Description must be a string' })
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .nullable()
    .optional(),

  icon: z
    .string({ error: 'Icon must be a string' })
    .max(100, 'Icon must be less than 100 characters')
    .trim()
    .nullable()
    .optional(),

  parentId: z
    .string({ error: 'Parent ID must be a string' })
    .nullable()
    .optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
