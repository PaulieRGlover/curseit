import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const SignUpSchema = z.object({
  login: z.string(),
  password: z.string(),
});
export type SignUp = z.infer<typeof SignUpSchema>;

export class SignUpDto extends createZodDto(SignUpSchema) {}

export const SignInSchema = SignUpSchema;
export type SignIn = SignUp;

export class SignInDto extends createZodDto(SignInSchema) {}

export const UserSchema = z.object({
  id: z.string(),
  login: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export class UserDto extends createZodDto(UserSchema) {}
