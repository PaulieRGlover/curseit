import { createZodDto } from '@anatine/zod-nestjs';

import z from 'zod';

import { MAXIMUM_TIMESTAMP } from '@curseit/time';

export const JwtCreateSchema = z.object({
  sub: z.string(),
  jti: z.string(),
});
export class JwtCreateDto extends createZodDto(JwtCreateSchema) {}

export const JwtReadSchema = JwtCreateSchema.extend({
  iat: z
    .number()
    .positive()
    .lte(MAXIMUM_TIMESTAMP / 1000),
  exp: z
    .number()
    .positive()
    .lte(MAXIMUM_TIMESTAMP / 1000),
});
export class JwtReadDto extends createZodDto(JwtReadSchema) {}
