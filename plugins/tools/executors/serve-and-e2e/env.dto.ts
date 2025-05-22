import z from 'zod';

export const EnvSchema = z
  .object({
    PORT: z.string(),
  })
  .transform(env => ({
    port: env.PORT,
  }));
