import { CONFIG_MESSAGES } from '@/messages';
import { registerAs } from '@nestjs/config';
import z from 'zod';

export const AppConfigSchema = z.object({
  PORT: z.coerce.number(),
}).transform(env => ({
  port: env.PORT,
}));
export type AppConfig = z.infer<typeof AppConfigSchema>;

export const appConfig = registerAs('app', async () => {
  const result = AppConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_PORT;
  }

  return result.data;
});
