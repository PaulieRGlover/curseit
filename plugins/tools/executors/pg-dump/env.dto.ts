import z from 'zod';

import { DB_URL_REGEX } from './constants';

export const EnvSchema = z
  .object({
    DATABASE_URL: z.string().refine(url => DB_URL_REGEX.test(url)),
  })
  .transform(env => ({
    databaseUrl: env.DATABASE_URL,
  }));
