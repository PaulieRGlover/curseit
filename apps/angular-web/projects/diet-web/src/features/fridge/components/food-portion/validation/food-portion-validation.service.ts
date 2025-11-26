import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';

@Injectable({ providedIn: 'root' })
export class FoodPortionValidationService {
  public async counter(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types')).counter;
    return zodValidateForFormControl(schema, control);
  }

  public async portionSize(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types')).portionSize;
    return zodValidateForFormControl(schema, control);
  }
}
