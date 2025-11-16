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

import {
  Food,
  FoodWithVariations,
  FoodsWithPortions,
  NutrientsAbridged,
  Variation,
  VariationCreate,
  VariationNutrient,
  VariationUpdate,
  VariationWithNutrients,
} from './types/external/food.types';
import { FoodCreate, FoodUpdate } from './types/internal/food.types';
import { VariationNutrientCreate, VariationNutrientUpdate } from './types/internal/nutrient.types';
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

  @Post('foods', ':foodId', 'variations')
  @UseValidation('variation')
  async createVariation(
    payload: VariationCreate,
    options: { params: { foodId: string } },
  ): Promise<ApiResult<Variation, Failure>> {
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

  @Patch('variations', ':variationId')
  @UseValidation('variation')
  async updateVariation(
    payload: VariationUpdate,
    options: { params: { variationId: string } },
  ): Promise<ApiResult<Variation, Failure>> {
    return undefined!;
  }

  @Delete('variations', ':variationId')
  @UseValidation('variation')
  async deleteVariation(
    payload: undefined,
    options: { params: { variationId: string } },
  ): Promise<ApiResult<Variation, Failure>> {
    return undefined!;
  }

  @Post('variations', ':variationId', 'nutrients')
  @UseValidation('variationNutrient')
  async createNutrient(
    payload: VariationNutrientCreate,
    options: { params: { variationId: string } },
  ): Promise<ApiResult<VariationNutrient, Failure>> {
    return undefined!;
  }

  @Patch('variations', ':variationId', 'nutrients', ':variationNutrientId')
  @UseValidation('variationNutrient')
  async updateNutrient(
    payload: VariationNutrientUpdate,
    options: { params: { variationId: string; variationNutrientId: string } },
  ): Promise<ApiResult<VariationNutrient, Failure>> {
    return undefined!;
  }

  @Delete('variations', ':variationId', 'nutrients', ':variationNutrientId')
  @UseValidation('variationNutrient')
  async deleteNutrient(
    payload: undefined,
    options: { params: { variationId: string; variationNutrientId: string } },
  ): Promise<ApiResult<VariationNutrient, Failure>> {
    return undefined!;
  }

  @Get('variations', ':variationId', 'nutrients-not-repeated')
  @UseValidation('nutrientsAbridged')
  async searchNutrientsNotRepeated(
    payload: undefined,
    options: { params: { variationId: string }; query: { search?: string } },
  ): Promise<ApiResult<NutrientsAbridged, Failure>> {
    return undefined!;
  }
}
