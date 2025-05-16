import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const JwtCreateSchema = z.object({
  sub: z.string(),
  jti: z.string(),
});
export class JwtCreateDto extends createZodDto(JwtCreateSchema) {}

export const JwtReadSchema = JwtCreateSchema.extend({
  iat: z.number(),
  exp: z.number(),
});
export class JwtReadDto extends createZodDto(JwtReadSchema) {}
