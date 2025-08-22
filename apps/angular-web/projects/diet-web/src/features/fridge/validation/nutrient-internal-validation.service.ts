import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class NutrientInternalValidationService {
  public async name(control: AbstractControl) {
    const schema = (await import('../dto/internal/nutrient.dto')).name;
    return zodValidateForFormControl(schema, control);
  }

  public async valueUnit(control: AbstractControl) {
    const schema = (await import('../dto/internal/nutrient.dto')).valueUnit;
    return zodValidateForFormControl(schema, control);
  }

  public async nutrient(input: unknown) {
    const schema = (await import('../dto/internal/nutrient.dto')).nutrientInput;
    return zodValidate(schema, input, false);
  }
}
