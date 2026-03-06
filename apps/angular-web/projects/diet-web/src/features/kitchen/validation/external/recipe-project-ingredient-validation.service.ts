import { Injectable } from '@angular/core';

import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class RecipeProjectIngredientValidationService {
  public async failure(input: any) {
    const schema = (await import('@curseit/resource')).failure;
    return zodValidate(schema, input);
  }

  public async ingredients(input: unknown) {
    const schema = (await import('../../types/external/recipe-project-ingredient.types')).ingredients;
    return zodValidate(schema, input);
  }
}
