import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const SignInSchema = z.object({
  login: z.string(),
  password: z.string(),
});
export type SignIn = z.infer<typeof SignInSchema>;

export class SignInDto extends createZodDto(SignInSchema) {}

export const UserSchema = z.object({
  id: z.string(),
  login: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export class UserDto extends createZodDto(UserSchema) {}
