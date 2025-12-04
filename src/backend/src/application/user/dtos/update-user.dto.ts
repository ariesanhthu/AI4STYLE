import z from "zod"
import { updateUserProfileSchema } from "./update-user-profile.dto"

export const updateUserSchema = updateUserProfileSchema.extend({
    roleId: z.string().optional(),
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>