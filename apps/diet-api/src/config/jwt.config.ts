import { CONFIG_MESSAGES } from '@/messages';
import { registerAs } from '@nestjs/config';
import z from 'zod';

export const JwtConfigSchema = z.object({
  JWT_SECRET: z.string(),
}).transform(env => ({
  jwtSecret: env.JWT_SECRET,
}));
export type JwtConfig = z.infer<typeof JwtConfigSchema>;

export const jwtConfig = registerAs('jwt', async () => {
  const result = JwtConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_JWT_SECRET;
  }

  return result.data;
});
