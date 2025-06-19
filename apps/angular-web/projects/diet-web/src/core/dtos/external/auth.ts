import * as z from 'zod/v4-mini';
import { errorStatusCodesSchema } from './status-codes';

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
