import { Injectable, inject } from '@angular/core';

import {
  ApiResult,
  Get,
  Patch,
  Post,
  Resource,
  UseAuthorization,
  UseValidation,
} from '@curseit/resource';

import { DietResource } from '@/core/diet.resource';
import { Failure } from '@/core/dto/external/failure.dto';

import {
  Food,
  FoodWithVariations,
  FoodsWithPortions,
  Nutrient,
  VariationNutrient,
  VariationWithNutrients,
} from './dto/external/food.dto';
import { FoodCreate, FoodUpdate } from './dto/internal/food.dto';
import { NutrientCreate } from './dto/internal/nutrient.dto';
import { FoodsExternalValidationService } from './validation/foods-external-validation.service';

@Injectable({ providedIn: 'root' })
@Resource('fridge')
@UseAuthorization()
export class FridgeResource extends DietResource {
  validation = inject(FoodsExternalValidationService);

  @Get('foods')
  @UseValidation('foodsWithPortions')
  async getFoods(): Promise<ApiResult<FoodsWithPortions, Failure>> {
    return undefined!;
  }

  @Post('foods')
  @UseValidation('foodWithVariations')
  async createFood(payload: FoodCreate): Promise<ApiResult<FoodWithVariations, Failure>> {
    return undefined!;
  }

  @Get('foods', ':foodId')
  @UseValidation('foodWithVariations')
  async getFood(
    payload: undefined,
    options: { params: { foodId: string } },
  ): Promise<ApiResult<FoodWithVariations, Failure>> {
    return undefined!;
  }

  @Patch('foods', ':foodId')
  @UseValidation('food')
  async updateFood(
    payload: FoodUpdate,
    options: { params: { foodId: string } },
  ): Promise<ApiResult<Food, Failure>> {
    return undefined!;
  }

  @Get('variations', ':variationId')
  @UseValidation('variationWithNutrients')
  async getVariation(
    payload: undefined,
    options: { params: { variationId: string } },
  ): Promise<ApiResult<VariationWithNutrients, Failure>> {
    return undefined!;
  }

  @Post('variations', ':variationId', 'nutrients')
  @UseValidation('variationNutrient')
  async createNutrient(
    payload: NutrientCreate,
    options: { params: { variationId: string } },
  ): Promise<ApiResult<VariationNutrient, Failure>> {
    return undefined!;
  }

  @Get('nutrients')
  @UseValidation('nutrients')
  async searchNutrients(
    payload: undefined,
    options: { query: { search: string } },
  ): Promise<ApiResult<Array<Nutrient>, Failure>> {
    return undefined!;
  }
}
