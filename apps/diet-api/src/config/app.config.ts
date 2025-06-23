import { registerAs } from '@nestjs/config';

import z from 'zod';

import { CONFIG_MESSAGES } from '@/messages';
import { isMsStringValue } from '@curseit/ms';
import ms from 'ms';

export const AppConfigSchema = z
  .object({
    MODE: z.union([z.literal('local_development'), z.literal('e2e'), z.literal('production')]),
    PORT: z.coerce.number().optional(),
    ARTIFICIAL_AUTH_DELAY: z
      .string()
      .refine(
        value => isMsStringValue(value),
        value => ({ message: CONFIG_MESSAGES.ARTIFICIAL_AUTH_DELAY_WRONG_FORMAT(value) }),
      )
      .optional(),
  })
  .transform(env => ({
    mode: env.MODE,
    port: env.PORT ?? 3000,
    artificialAuthDelay: ms(env.ARTIFICIAL_AUTH_DELAY ?? '0ms'),
  }));
export const AppConfig = registerAs('app', async () => {
  const result = AppConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_APP_CONFIG(result.error);
  }

  return result.data;
});
