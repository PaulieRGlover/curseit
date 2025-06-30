import type { ZodMiniType, infer as ZInfer } from 'zod/v4-mini';

export const zodValidate = <T extends ZodMiniType>(
  schema: T,
  input: unknown,
): ZInfer<T> => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(`Backend to Frontend Validation Error: ${result.error}`)
  } else {
    return result.data;
  }
};
