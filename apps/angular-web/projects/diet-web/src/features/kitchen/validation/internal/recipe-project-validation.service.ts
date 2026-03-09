import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';
import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class RecipeProjectValidationService {
  public async spendPortions(control: AbstractControl) {
    const schema = (await import('../../types/internal/recipe-project.types')).spendPortions;
    return zodValidateForFormControl(schema, control);
  }

  public async recipeProjectUpdate(input: unknown) {
    const schema = (await import('../../types/internal/recipe-project.types')).recipeProjectUpdate;
    return zodValidate(schema, input);
  }
}
