import * as z from 'zod/v4-mini';

const EMOJI_ERROR = 'Should be an emoji';

export const emojiSymbol = z.string().check(z.emoji({ error: EMOJI_ERROR }));
export type EmojiSymbol = z.infer<typeof emojiSymbol>;

export const emoji = z.object({
  symbol: emojiSymbol,
  name: z.string(),
  slug: z.string(),
});
export type Emoji = z.infer<typeof emoji>;
