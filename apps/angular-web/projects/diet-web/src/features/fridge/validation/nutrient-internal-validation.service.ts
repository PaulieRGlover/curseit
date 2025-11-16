import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class NutrientInternalValidationService {
  public async name(control: AbstractControl) {
    const schema = (await import('../types/internal/nutrient.types')).variationNutrientName;
    return zodValidateForFormControl(schema, control);
  }
}
