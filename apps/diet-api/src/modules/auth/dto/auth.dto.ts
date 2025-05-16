import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const SignUpSchema = z.object({
  login: z.string(),
  password: z.string(),
});
export class SignUpDto extends createZodDto(SignUpSchema) {}

export const SignInSchema = SignUpSchema.extend({});
export class SignInDto extends createZodDto(SignInSchema) {}

export const TokensSchema = z.object({
  idToken: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});
export class TokensDto extends createZodDto(TokensSchema) {}

export const SignInResponseSchema = z.object({
  access_token: z.string(),
});
export class SignInResponseDto extends createZodDto(SignInResponseSchema) {}

export const SignUpResponseSchema = SignInResponseSchema.extend({});
export class SignUpResponseDto extends createZodDto(SignUpResponseSchema) {}

export const RefreshResponseSchema = SignInResponseSchema.extend({});
export class RefreshResponseDto extends createZodDto(RefreshResponseSchema) {}
