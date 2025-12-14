import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class FoodValidationService {
  public async name(control: AbstractControl) {
    const schema = (await import('../../types/internal/food.types')).name;
    return zodValidateForFormControl(schema, control);
  }

  public async description(control: AbstractControl) {
    const schema = (await import('../../types/internal/food.types')).description;
    return zodValidateForFormControl(schema, control);
  }

  public async perishable(control: AbstractControl) {
    const schema = (await import('../../types/internal/food.types')).perishable;
    return zodValidateForFormControl(schema, control);
  }

  public async favorite(control: AbstractControl) {
    const schema = (await import('../../types/internal/food.types')).favorite;
    return zodValidateForFormControl(schema, control);
  }

  public async foodUpdate(input: unknown) {
    const schema = (await import('../../types/internal/food.types')).foodCreate;
    return zodValidate(schema, input, false);
  }
}
