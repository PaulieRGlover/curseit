import { Injectable, inject } from '@angular/core';

import {
  ApiResult,
  Delete,
  Failure,
  Get,
  Patch,
  Post,
  Resource,
  UseAuthorization,
  UseValidation,
} from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { DietResource } from '@/core/diet.resource';

import { RecipeProject, RecipeProjectWithIngredients } from '../types/external/recipe-project.types';
import { RecipeProjectValidationService } from '../validation/external/recipe-project-validation.service';
import { RecipeProjectUpdate, RecipeProjectWithIngredientsCreate } from '../types/internal/recipe-project.types';

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

  @Patch()
  @UseValidation('recipeProject')
  async update(payload: {
    body: RecipeProjectUpdate,
  }): Promise<ApiResult<RecipeProject, Failure>> {
    return undefined!;
  }

  @Delete()
  @UseValidation('recipeProject')
  async delete(): Promise<ApiResult<RecipeProject, Failure>> {
    return undefined!;
  }
}
