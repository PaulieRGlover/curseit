import type { ZodMiniType, infer as ZInfer } from 'zod/v4-mini';

export const zodValidate = <T extends ZodMiniType>(
  schema: T,
  input: unknown,
  external = true,
): ZInfer<T> => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(`${external ? `Backend to ` : ''}Frontend Validation Error: ${result.error}`)
  } else {
    return result.data;
  }
};
