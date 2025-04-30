import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  login: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export class UserDto extends createZodDto(UserSchema) {}
