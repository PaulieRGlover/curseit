import * as z from 'zod/v4-mini';

export const loginSchema = z.string().check(
  z.email({ error: 'Login must be a valid email' }),
);
