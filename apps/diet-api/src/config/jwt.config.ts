import { registerAs } from '@nestjs/config';

import ms from 'ms';
import z from 'zod';

import { isMsStringValue } from '@curseit/ms';

import { CONFIG_MESSAGES } from '@/messages';

export const JwtConfigSchema = z
  .object({
    ID_JWT_SECRET: z.string(),
    ACCESS_JWT_SECRET: z.string(),
    REFRESH_JWT_SECRET: z.string(),
    ACCESS_TOKEN_TTL: z
      .string()
      .refine(
        value => isMsStringValue(value),
        value => ({ message: CONFIG_MESSAGES.TTL_WRONG_FORMAT(value) }),
      )
      .optional(),
    REFRESH_TOKEN_TTL: z
      .string()
      .optional()
      .refine(
        value => isMsStringValue(value),
        value => ({ message: CONFIG_MESSAGES.TTL_WRONG_FORMAT(value) }),
      )
      .optional(),
  })
  .transform(env => ({
    idJwtSecret: env.ID_JWT_SECRET,
    accessJwtSecret: env.ACCESS_JWT_SECRET,
    refreshJwtSecret: env.REFRESH_JWT_SECRET,
    accessTokenTtlInMs: ms(env.ACCESS_TOKEN_TTL ?? '15m'),
    refreshTokenTtlInMs: ms(env.REFRESH_TOKEN_TTL ?? '30d'),
  }));
export const JwtConfig = registerAs('jwt', async () => {
  const result = JwtConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_JWT_CONFIG(result.error);
  }

  return result.data;
});
