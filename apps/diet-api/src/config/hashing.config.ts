import { CONFIG_MESSAGES } from '@/messages';
import { registerAs } from '@nestjs/config';
import z from 'zod';

export const HashingConfigSchema = z.object({
  HASH_SECRET: z.string(),
}).transform(env => ({
  hashSecret: env.HASH_SECRET,
}));
export const HashingConfig = registerAs('hash', async () => {
  const result = HashingConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw CONFIG_MESSAGES.INVALID_HASHING_CONFIG(result.error);
  }

  return result.data;
});
