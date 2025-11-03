import z from "zod";

export const signUpSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(1, 'Name is required'),
  otp: z.string().length(6, 'OTP must be 6 characters long'),
});

export type SignUpDto = z.infer<typeof signUpSchema>;