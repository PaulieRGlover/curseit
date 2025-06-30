import * as z from 'zod/v4-mini';

import { ERROR_STATUS_CODES } from '@/core/constants/api.constants';

export const errorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.enum(ERROR_STATUS_CODES),
});

export const failureSchema = z.object({
  status: z.enum(ERROR_STATUS_CODES),
  ok: z.literal(false),
  error: errorSchema,
});
export type Failure = z.infer<typeof failureSchema>;
