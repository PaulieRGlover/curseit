import { CONFIG_MESSAGES } from '@/messages';
import { registerAs } from '@nestjs/config';
import z from 'zod';

export const AppConfigSchema = z.object({
  PORT: z.coerce.number(),
}).transform(env => ({
  port: env.PORT,
}));
export const AppConfig = registerAs('app', async () => {
  const result = AppConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_PORT;
  }

  return result.data;
});
