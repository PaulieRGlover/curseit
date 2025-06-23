import * as z from 'zod/v4-mini';
import { errorStatusCodesSchema } from './status-codes.dto';
import { JWT_REGEX } from '@curseit/jwt';

export const errorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: errorStatusCodesSchema,
});

export const errorResponseSchema = z.object({
  status: errorStatusCodesSchema,
  ok: z.literal(false),
  error: errorSchema,
});

export const successResponseSchema = z.object({
  access_token: z.string().check(z.regex(JWT_REGEX)),
});
