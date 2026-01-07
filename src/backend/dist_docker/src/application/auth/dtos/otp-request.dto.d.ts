import { EOtpType } from '@/core/auth/enums';
import z from 'zod';
export declare const otpRequestSchema: z.ZodObject<{
    email: z.ZodEmail;
    type: z.ZodEnum<typeof EOtpType>;
}, z.core.$strip>;
export type OtpRequestDto = z.infer<typeof otpRequestSchema>;
