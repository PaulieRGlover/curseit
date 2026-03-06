import { Injectable, inject } from '@angular/core';

import {
  ApiResult,
  Delete,
  Failure,
  Get,
  Post,
  Resource,
  UseAuthorization,
  UseValidation,
} from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { DietResource } from '@/core/diet.resource';

import { RecipeProjectWithIngredients } from '../types/external/recipe-project.types';
import { RecipeProjectValidationService } from '../validation/external/recipe-project-validation.service';
import { RecipeProjectWithIngredientsCreate } from '../types/internal/recipe-project.types';

@Injectable({ providedIn: 'root' })
@Resource('kitchen/project')
@UseAuthorization()
export class RecipeProjectResource extends DietResource {
  validation = inject(RecipeProjectValidationService);

  @Get()
  @UseValidation('recipeProjectWithIngredientsNullable')
  async get(): Promise<ApiResult<Nullable<RecipeProjectWithIngredients>, Failure>> {
    return undefined!;
  }

  @Post()
  @UseValidation('recipeProjectWithIngredients')
  async create(payload: {
    body: RecipeProjectWithIngredientsCreate,
  }): Promise<ApiResult<RecipeProjectWithIngredients, Failure>> {
    return undefined!;
  }

  @Delete()
  @UseValidation('recipeProjectWithIngredients')
  async delete(): Promise<ApiResult<RecipeProjectWithIngredients, Failure>> {
    return undefined!;
  }
}
