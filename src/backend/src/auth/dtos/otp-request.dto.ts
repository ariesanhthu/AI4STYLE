import z from "zod";
import { EOtpType } from "../enums/otp-type.enum";

export const otpRequestSchema = z.object({
  email: z.email('Invalid email address'),
  type: z.enum(EOtpType),
});

export type OtpRequestDto = z.infer<typeof otpRequestSchema>;