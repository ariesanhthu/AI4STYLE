import z from "zod";

export const updateUserProfileSchema = z.object({
  phone: z
    .string('Phone must be a string')
    .min(10, 'Phone must have 10 characters')
    .max(10, 'Phone must have 10 characters')
    .optional(),

  name: z
    .string('Name must be a string')
    .min(2)
    .max(100)
    .optional(),

  avatar: z
    .string('Avatar must be a string')
    .optional(),

  birthdate: z
    .date('Birthdate must be a date')
    .optional(),
    
  address: z
    .string('Address must be a string')
    .max(200)
    .optional(),
})

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;