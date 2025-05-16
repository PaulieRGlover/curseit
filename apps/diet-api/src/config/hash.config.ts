import { CONFIG_MESSAGES } from '@/messages';
import { registerAs } from '@nestjs/config';
import z from 'zod';

export const HashConfigSchema = z.object({
  HASH_SECRET: z.string(),
}).transform(env => ({
  hashSecret: env.HASH_SECRET,
}));
export const HashConfig = registerAs('hash', async () => {
  const result = HashConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_HASH_SECRET;
  }

  return result.data;
});
