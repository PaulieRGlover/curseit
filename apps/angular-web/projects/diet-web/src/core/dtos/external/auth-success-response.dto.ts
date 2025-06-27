import * as z from 'zod/v4-mini';

import { JWT_REGEX } from '@curseit/jwt';

export const successResponseSchema = z.object({
  access_token: z.string().check(z.regex(JWT_REGEX)),
});
