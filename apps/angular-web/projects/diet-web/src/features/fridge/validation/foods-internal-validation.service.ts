import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class FoodsInternalValidationService {
  public async name(control: AbstractControl) {
    const schema = (await import('../dto/internal/food.dto')).name;
    return zodValidateForFormControl(schema, control);
  }

  public async description(control: AbstractControl) {
    const schema = (await import('../dto/internal/food.dto')).description;
    return zodValidateForFormControl(schema, control);
  }

  public async perishable(control: AbstractControl) {
    const schema = (await import('../dto/internal/food.dto')).perishable;
    return zodValidateForFormControl(schema, control);
  }

  public async favorite(control: AbstractControl) {
    const schema = (await import('../dto/internal/food.dto')).favorite;
    return zodValidateForFormControl(schema, control);
  }

  public async food(input: unknown) {
    const schema = (await import('../dto/internal/food.dto')).foodInputSchema;
    return zodValidate(schema, input, false);
  }
}
