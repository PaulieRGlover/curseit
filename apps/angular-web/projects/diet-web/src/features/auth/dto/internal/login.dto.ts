import * as z from 'zod/v4-mini';

export const loginSchema = z.string().check(
  z.email({ message: 'Login must be a valid email' }),
);
