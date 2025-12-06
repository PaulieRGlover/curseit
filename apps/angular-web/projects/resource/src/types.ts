import * as z from 'zod/v4-mini';

import { ERROR_STATUS_CODES } from './constants';

export type ApiResult<T, U> = Promise<
  { success: T; failure?: never } | { success?: never; failure: U }
>;

const standardErrorMessage = z.pipe(
  z.string(),
  z.transform(value => {
    const [, path, message] = value.match(/^([\w\.\d]+): ([\w\s]+)$/) ?? [];
    return {
      path: path ? path.split('.') : [],
      description: message ?? value,
    };
  }),
);

const standardError = z.object({
  error: z.string(),
  message: z.pipe(
    z.union([standardErrorMessage, z.array(standardErrorMessage)]),
    z.transform(value => {
      return Array.isArray(value) ? value : [value];
    }),
  ),
  statusCode: z.enum(ERROR_STATUS_CODES),
});
export type StandardError = z.infer<typeof standardError>;

export const failure = z.object({
  status: z.enum(ERROR_STATUS_CODES),
  ok: z.literal(false),
  error: standardError,
});
export type Failure = z.infer<typeof failure>;
