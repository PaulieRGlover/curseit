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
  public async portionSizeValue(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types'))
      .portionSizeValue;
    return zodValidateForFormControl(schema, control);
  }

  public async portionSizeUnit(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types'))
      .portionSizeUnit;
    return zodValidateForFormControl(schema, control);
  }

  public async remainingValue(control: AbstractControl) {
    const schema = (await import('../types/portion.types')).remainingValue;
    return zodValidateForFormControl(schema, control);
  }

  public async remainingUnit(control: AbstractControl) {
    const schema = (await import('../types/portion.types')).remainingUnit;
    return zodValidateForFormControl(schema, control);
  }

  public async portionModel(input: unknown) {
    const schema = (await import('../types/portion.types')).portionModel;
    return zodValidate(schema, input);
  }

  public async variationUpdate(input: unknown) {
    const schema = (await import('../../../types/internal/variation.types')).variationUpdate;
    return zodValidate(schema, input);
  }
}
