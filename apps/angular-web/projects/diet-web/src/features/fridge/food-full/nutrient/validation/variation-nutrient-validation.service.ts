import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class VariationNutrientValidationService {
  public async amount(control: AbstractControl) {
    const schema = (await import('../types/variation-nutrient-input.types')).amount;
    return zodValidateForFormControl(schema, control);
  }

  public async variationNutrientInput(input: unknown) {
    const schema = (await import('../types/variation-nutrient-input.types')).variationNutrientInput;
    return zodValidate(schema, input);
  }

  public async variationNutrientInputUpdate(input: unknown) {
    const schema = (await import('../types/variation-nutrient-input.types'))
      .variationNutrientInputUpdate;
    return zodValidate(schema, input);
  }
}
