import { Injectable } from '@angular/core';

import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class RecipeProjectValidationService {
  public async failure(input: any) {
    const schema = (await import('@curseit/resource')).failure;
    return zodValidate(schema, input);
  }

  public async recipeProject(input: unknown) {
    const schema = (await import('../../types/external/recipe-project.types')).recipeProject;
    return zodValidate(schema, input);
  }
  
  public async recipeProjectWithIngredients(input: unknown) {
    const schema = (await import('../../types/external/recipe-project.types'))
      .recipeProjectWithIngredients;
    return zodValidate(schema, input);
  }

  public async recipeProjectWithIngredientsNullable(input: unknown) {
    const schema = (await import('../../types/external/recipe-project.types'))
      .recipeProjectWithIngredientsNullable;
    return zodValidate(schema, input);
  }
}
