import * as z from 'zod/v4-mini';

export const idTokenPayloadSchema = z.object({
  sub: z.string(),
  login: z.string(),
  given_name: z.string(),
  family_name: z.string(),
});
export type IdTokenPayload = z.infer<typeof idTokenPayloadSchema>;
