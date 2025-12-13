import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class VariationNutrientValidationService {
  public async amount(control: AbstractControl) {
    const schema = (await import('../types/variation-nutrient.types')).amount;
    return zodValidateForFormControl(schema, control);
  }

  public async nutrientModel(input: unknown) {
    const schema = (await import('../types/variation-nutrient.types')).nutrientModel;
    return zodValidate(schema, input);
  }
}
