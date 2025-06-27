import * as z from 'zod/v4-mini';

export const passwordSchema = z.string().check(
  z.minLength(1, { message: 'Password is required' }),
);
