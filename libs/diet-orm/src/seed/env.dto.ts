import z from 'zod';

export const EnvSchema = z
  .object({
    DATABASE_URL: z.string(),
    HASH_SECRET: z.string(),
  })
  .transform(env => ({
    databaseUrl: env.DATABASE_URL,
    hashSecret: env.HASH_SECRET,
  }));
