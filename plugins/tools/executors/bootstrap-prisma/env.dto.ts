import z from 'zod';

export const EnvSchema = z
  .object({
    DATABASE_URL: z.string(),
  })
  .transform(env => ({
    databaseUrl: env.DATABASE_URL,
  }));
