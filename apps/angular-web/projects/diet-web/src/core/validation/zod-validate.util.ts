import * as z from 'zod/v4-mini';

import type { Nullable } from '@curseit/types';

export const zodValidate =
  <T extends z.ZodMiniType>(schema: T): ((input: unknown) => Nullable<z.infer<T>>) =>
  input => {
    const result = schema.safeParse(input);
    return result.success ? result.data : null;
  };
