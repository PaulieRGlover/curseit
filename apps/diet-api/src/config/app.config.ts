import { registerAs } from '@nestjs/config';

import z from 'zod';

import { CONFIG_MESSAGES } from '@/messages';

export const AppConfigSchema = z
  .object({
    PORT: z.coerce.number().optional(),
  })
  .transform((env) => ({
    port: env.PORT ?? 3000,
  }));
export const AppConfig = registerAs('app', async () => {
  const result = AppConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_APP_CONFIG(result.error);
  }

  return result.data;
});
