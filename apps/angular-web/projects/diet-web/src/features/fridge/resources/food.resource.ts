import { Injectable, inject } from '@angular/core';

import {
  ApiResult,
  Delete,
  Get,
  Patch,
  Post,
  Resource,
  UseAuthorization,
  UseValidation,
} from '@curseit/resource';

import { DietResource } from '@/core/diet.resource';
import { Failure } from '@/core/types/external/failure.types';

import { Food, FoodWithVariations, FoodsWithPortions } from '../types/external/food.types';
import { Portions } from '../types/external/portion.types';
import { Variation, VariationCreate, Variations } from '../types/external/variation.types';
import { FoodCreate, FoodUpdate } from '../types/internal/food.types';
import { FoodsExternalValidationService } from '../validation/foods-external-validation.service';

@Injectable({ providedIn: 'root' })
@Resource('fridge/foods')
@UseAuthorization()
export class FoodResource extends DietResource {
  validation = inject(FoodsExternalValidationService);

  @Get('')
  @UseValidation('foodsWithPortions')
  async read(): Promise<ApiResult<FoodsWithPortions, Failure>> {
    return undefined!;
  }

  @Post('')
  @UseValidation('foodWithVariations')
  async create(payload: { body: FoodCreate }): Promise<ApiResult<FoodWithVariations, Failure>> {
    return undefined!;
  }

  @Get(':foodId')
  @UseValidation('foodWithVariations')
  async getById(payload: {
    params: { foodId: string };
  }): Promise<ApiResult<FoodWithVariations, Failure>> {
    return undefined!;
  }

  @Patch(':foodId')
  @UseValidation('food')
  async update(payload: {
    body: FoodUpdate;
    params: { foodId: string };
  }): Promise<ApiResult<Food, Failure>> {
    return undefined!;
  }

  @Get(':foodId/variations')
  @UseValidation('variations')
  async readVariations(payload: {
    params: { foodId: string };
  }): Promise<ApiResult<Variations, Failure>> {
    return undefined!;
  }

  @Post(':foodId/variations')
  @UseValidation('variation')
  async createVariation(payload: {
    body: VariationCreate;
    params: { foodId: string };
  }): Promise<ApiResult<Variation, Failure>> {
    return undefined!;
  }

  @Get(':foodId/portions')
  @UseValidation('portions')
  async readPortions(payload: {
    params: { foodId: string };
  }): Promise<ApiResult<Portions, Failure>> {
    return undefined!;
  }
}
