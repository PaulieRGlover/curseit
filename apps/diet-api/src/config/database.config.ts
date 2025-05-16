import { CONFIG_MESSAGES } from '@/messages';
import { registerAs } from '@nestjs/config';
import z from 'zod';

export const DatabaseConfigSchema = z.object({
  DATABASE_URL: z.string(),
}).transform(env => ({
  url: env.DATABASE_URL,
}));
export const DatabaseConfig = registerAs('database', async () => {
  const result = DatabaseConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_DATABASE_CONFIG(result.error);
  }

  return result.data;
});
