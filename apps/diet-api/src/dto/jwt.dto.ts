import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const JwtCreateSchema = z.object({
  sub: z.string(),
  jti: z.string(),
});
export type JwtCreate = z.infer<typeof JwtCreateSchema>;

export class JwtCreateDto extends createZodDto(JwtCreateSchema) {}

export const JwtReadSchema = JwtCreateSchema.extend({
  iat: z.number(),
  exp: z.number(),
});
export type JwtRead = z.infer<typeof JwtReadSchema>;

export class JwtReadDto extends createZodDto(JwtReadSchema) {}
