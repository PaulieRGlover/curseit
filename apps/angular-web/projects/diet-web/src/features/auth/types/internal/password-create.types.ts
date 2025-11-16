import * as z from 'zod/v4-mini';

export const passwordCreateSchema = z.string().check(
  z.regex(/[a-z]/, { error: 'Must contain lower-case letters' }),
  z.regex(/[A-Z]/, { error: 'Must contain upper-case letters' }),
  z.regex(/[^a-zA-Z0-9]/, { error: 'Must contain special characters' }),
  z.regex(/[0-9]/, { error: 'Must contain numbers' }),
  z.minLength(8, { error: 'Must be at least 8 characters long' }),
);