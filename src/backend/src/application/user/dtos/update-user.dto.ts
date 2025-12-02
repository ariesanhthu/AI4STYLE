import z from "zod"
import { updateUserProfileSchema } from "./update-user-profile.dto"

export const updateUserSchema = updateUserProfileSchema.extend({
    roleId: z.number().optional(),
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>