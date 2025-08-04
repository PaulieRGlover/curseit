import * as z from 'zod/v4-mini';

import { JWT_REGEX } from '@curseit/jwt';

export const successSchema = z.object({
  access_token: z.string().check(z.regex(JWT_REGEX)),
});
export type Success = z.infer<typeof successSchema>;
