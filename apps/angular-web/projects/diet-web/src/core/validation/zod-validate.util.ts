import type { Nullable } from '@curseit/types';
import type { ZodMiniType, infer as ZInfer } from 'zod/v4-mini';

export const zodValidate = <T extends ZodMiniType>(
  schema: T,
  input: unknown,
): Nullable<ZInfer<T>> => {
  const result = schema.safeParse(input);
  return result.success ? result.data : null;
};
