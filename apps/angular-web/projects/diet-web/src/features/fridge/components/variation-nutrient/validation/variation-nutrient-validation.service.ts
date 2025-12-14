import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class VariationNutrientValidationService {
  public async amountValue(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types'))
      .variationNutrientValue;
    return zodValidateForFormControl(schema, control);
  }

  public async amountUnit(control: AbstractControl) {
    const schema = (await import('@/features/fridge/types/internal/variation.types'))
      .nutrientUnit;
    return zodValidateForFormControl(schema, control);
  }

  public async nutrientModel(input: unknown) {
    const schema = (await import('../types/variation-nutrient.types')).nutrientModel;
    return zodValidate(schema, input);
  }
}
