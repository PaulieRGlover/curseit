import { CONFIG_MESSAGES } from '@/messages';
import { registerAs } from '@nestjs/config';
import z from 'zod';

export const JwtConfigSchema = z.object({
  ID_JWT_SECRET: z.string(),
  ACCESS_JWT_SECRET: z.string(),
  REFRESH_JWT_SECRET: z.string(),
}).transform(env => ({
  idJwtSecret: env.ID_JWT_SECRET,
  accessJwtSecret: env.ACCESS_JWT_SECRET,
  refreshJwtSecret: env.REFRESH_JWT_SECRET,
}));
export type JwtConfig = z.infer<typeof JwtConfigSchema>;

export const jwtConfig = registerAs('jwt', async () => {
  const result = JwtConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_JWT_SECRET;
  }

  return result.data;
});
