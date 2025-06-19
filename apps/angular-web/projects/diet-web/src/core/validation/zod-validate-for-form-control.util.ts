import { AbstractControl } from '@angular/forms';

import { Nullable } from '@curseit/types';
import * as z from 'zod/v4-mini';

export const zodValidate =
  (schema: z.ZodMiniType) =>
  (control: AbstractControl): Nullable<Record<string, string>> => {
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
