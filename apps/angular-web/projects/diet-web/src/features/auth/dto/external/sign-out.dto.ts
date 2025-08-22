import * as z from 'zod/v4-mini';

export const signOutSchema = z.object({
  message: z.string(),
});
export type SignOut = z.infer<typeof signOutSchema>;
