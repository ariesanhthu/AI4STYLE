import z from 'zod';
import { signUpGuestSchema } from './sign-up-guest.dto';

export const signUpStaffSchema = signUpGuestSchema.extend({
  role_id: z.string('Role ID is required'),
});

export type SignUpStaffDto = z.infer<typeof signUpStaffSchema>;
