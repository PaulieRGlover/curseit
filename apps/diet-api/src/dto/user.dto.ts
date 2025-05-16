import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  login: z.string(),
});
export class UserDto extends createZodDto(UserSchema) {}
