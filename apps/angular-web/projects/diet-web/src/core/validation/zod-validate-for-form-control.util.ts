import type { ZodMiniType } from 'zod/v4-mini';

import type { Nullable } from '@curseit/types';

export const zodValidate = <T extends ZodMiniType>(
  schema: T,
  input: unknown,
): Nullable<Record<string, string>> => {
  const result = schema.safeParse(input);
  return (
    result.error?.issues.reduce<Nullable<Record<string, string>>>((errorObject, error) => {
      return {
        ...(errorObject ?? {}),
        [error.code]: error.message,
      };
    }, null) ?? null
  );
};
