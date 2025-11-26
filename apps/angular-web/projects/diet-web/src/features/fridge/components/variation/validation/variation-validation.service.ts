import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class VariationValidationService {
  public async referenceSize(control: AbstractControl) {
    const schema = (await import('../types/variation-input.types')).referenceSize;
    return zodValidateForFormControl(schema, control);
  }

  public async energy(control: AbstractControl) {
    const schema = (await import('../types/variation-input.types')).energy;
    return zodValidateForFormControl(schema, control);
  }

  public async portionSize(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types')).portionSize;
    return zodValidateForFormControl(schema, control);
  }

  public async variationInput(input: unknown) {
    const schema = (await import('../types/variation-input.types')).variationInput;
    return zodValidate(schema, input);
  }

  public async variationInputUpdate(input: unknown) {
    const schema = (await import('../types/variation-input.types')).variationInputUpdate;
    return zodValidate(schema, input);
  }

  public async counter(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types')).counter;
    return zodValidateForFormControl(schema, control);
  }
}
