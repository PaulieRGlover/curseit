import * as z from 'zod/v4-mini';

export const createPortionsCount = z
  .number()
  .check(
    z.minimum(1, {
      error:
        "How am I supposed to create negative portions? If you need to delete a portion, there's a bin icon slightly above",
    }),
    z.maximum(20, { error: "Let's not create more than 20 portions at a time" }),
  );
