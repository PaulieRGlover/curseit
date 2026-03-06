import { Injectable, inject } from '@angular/core';

import {
  ApiResult,
  Delete,
  Failure,
  Post,
  Resource,
  UseAuthorization,
  UseValidation,
} from '@curseit/resource';

import { DietResource } from '@/core/diet.resource';

import { RecipeProjectIngredientValidationService } from '../validation/external/recipe-project-ingredient-validation.service';
import { IngredientsCreate } from '../types/internal/recipe-project-ingredient.types';
import { Ingredient, Ingredients } from '../types/external/recipe-project-ingredient.types';

@Injectable({ providedIn: 'root' })
@Resource('kitchen/project/ingredients')
@UseAuthorization()
export class RecipeProjectIngredientResource extends DietResource {
  validation = inject(RecipeProjectIngredientValidationService);

  @Post()
  @UseValidation('ingredients')
  async create(payload: {
    body: IngredientsCreate,
  }): Promise<ApiResult<Ingredients, Failure>> {
    return undefined!;
  }

  @Post('action/bulk-delete')
  @UseValidation('ingredients')
  async bulkDelete(payload: {
    body: { ids: Array<Ingredient['id']> },
  }): Promise<ApiResult<Ingredients, Failure>> {
    return undefined!;
  }
}
