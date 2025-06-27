import * as z from 'zod/v4-mini';

export const passwordCreateSchema = z.string().check(
  z.regex(/[a-z]/, { message: 'Must contain lower-case letters' }),
  z.regex(/[A-Z]/, { message: 'Must contain upper-case letters' }),
  z.regex(/[^a-zA-Z0-9]/, { message: 'Must contain special characters' }),
  z.regex(/[0-9]/, { message: 'Must contain numbers' }),
  z.minLength(8, { message: 'Must be at least 8 characters long' }),
);