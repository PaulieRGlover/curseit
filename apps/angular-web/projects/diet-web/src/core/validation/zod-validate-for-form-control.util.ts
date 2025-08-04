import type { ZodMiniType } from 'zod/v4-mini';

import type { Nullable } from '@curseit/types';
import { AbstractControl } from '@angular/forms';

export const zodValidateForFormControl = <T extends ZodMiniType>(
  schema: T,
  control: AbstractControl,
): Nullable<Record<string, string>> => {
  const result = schema.safeParse(control.value);
  return (
    result.error?.issues.reduce<Nullable<Record<string, string>>>((errorObject, error) => {
      return {
        ...(errorObject ?? {}),
        [error.code]: error.message,
      };
    }, null) ?? null
  );
};
