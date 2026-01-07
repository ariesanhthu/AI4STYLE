import z from "zod";
export declare const updateUserSchema: z.ZodObject<{
    gender: z.ZodOptional<z.ZodEnum<typeof import("../../../core/user/enums").EGender>>;
    phone: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    birthdate: z.ZodOptional<z.ZodISODateTime>;
    address: z.ZodOptional<z.ZodString>;
    roleId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
