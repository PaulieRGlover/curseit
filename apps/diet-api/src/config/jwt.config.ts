import z from 'zod';
import { registerAs } from '@nestjs/config';
import { CONFIG_MESSAGES } from '@/messages';
import { isMsStringValue } from '@curseit/ms';

export const JwtConfigSchema = z.object({
  ID_JWT_SECRET: z.string(),
  ACCESS_JWT_SECRET: z.string(),
  REFRESH_JWT_SECRET: z.string(),
  ACCESS_TOKEN_TTL: z.string().refine(
    value => isMsStringValue(value),
    value => ({ message: CONFIG_MESSAGES.TTL_WRONG_FORMAT(value) }),
  ),
  REFRESH_TOKEN_TTL: z.string().refine(
    value => isMsStringValue(value),
    value => ({ message: CONFIG_MESSAGES.TTL_WRONG_FORMAT(value) }),
  ),
}).transform(env => ({
  idJwtSecret: env.ID_JWT_SECRET,
  accessJwtSecret: env.ACCESS_JWT_SECRET,
  refreshJwtSecret: env.REFRESH_JWT_SECRET,
  accessTokenTtl: env.ACCESS_TOKEN_TTL,
  refreshTokenTtl: env.REFRESH_TOKEN_TTL,
}));
export const JwtConfig = registerAs('jwt', async () => {
  const result = JwtConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_JWT_CONFIG(result.error);
  }

  return result.data;
});
