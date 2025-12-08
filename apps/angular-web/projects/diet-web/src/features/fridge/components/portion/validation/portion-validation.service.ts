import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class PortionValidationService {
  public async counter(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types')).counter;
    return zodValidateForFormControl(schema, control);
  }

  // TODO: why portion depends on variation types? Should not be variation types then?
  public async portionSize(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types')).portionSize;
    return zodValidateForFormControl(schema, control);
  }

  public async remaining(control: AbstractControl) {
    const schema = (await import('../types/portion.types')).remaining;
    return zodValidateForFormControl(schema, control);
  }

  public async portionInput(input: unknown) {
    const schema = (await import('../types/portion.types')).portionInput;
    return zodValidate(schema, input);
  }

  public async variationUpdate(input: unknown) {
    const schema = (await import('../../../types/internal/variation.types')).variationUpdate;
    return zodValidate(schema, input);
  }
}
