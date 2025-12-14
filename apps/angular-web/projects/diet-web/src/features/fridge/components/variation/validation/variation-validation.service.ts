import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class VariationValidationService {
  public async referenceSizeValue(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types'))
      .referenceSizeValue;
    return zodValidateForFormControl(schema, control);
  }

  public async referenceSizeUnit(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types'))
      .referenceSizeUnit;
    return zodValidateForFormControl(schema, control);
  }

  public async energyAmount(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types')).energyAmount;
    return zodValidateForFormControl(schema, control);
  }

  public async energyUnit(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types')).energyUnit;
    return zodValidateForFormControl(schema, control);
  }

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

  public async variationInput(input: unknown) {
    const schema = (await import('../types/variation.types')).variationModel;
    return zodValidate(schema, input);
  }

  public async variationModelUpdate(input: unknown) {
    const schema = (await import('../types/variation.types')).variationModelUpdate;
    return zodValidate(schema, input);
  }

  public async counter(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types')).counter;
    return zodValidateForFormControl(schema, control);
  }
}
