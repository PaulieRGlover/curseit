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
  Variation,
  VariationNutrient,
  VariationWithNutrients,
} from '../types/external/variation.types';
import {
  VariationNutrientCreate,
  VariationNutrientUpdate,
  VariationUpdate,
} from '../types/internal/variation.types';
import { VariationValidationService } from '../validation/external/variation-validation.service';

@Injectable({ providedIn: 'root' })
@Resource('fridge/variations')
@UseAuthorization()
export class VariationResource extends DietResource {
  validation = inject(VariationValidationService);

  @Get(':variationId')
  @UseValidation('variationWithNutrients')
  async getById(payload: {
    params: { variationId: string };
  }): Promise<ApiResult<VariationWithNutrients, Failure>> {
    return undefined!;
  }

  @Patch(':variationId')
  @UseValidation('variation')
  async update(payload: {
    body: VariationUpdate;
    params: { variationId: string };
  }): Promise<ApiResult<Variation, Failure>> {
    return undefined!;
  }

  @Delete(':variationId')
  @UseValidation('variation')
  async delete(payload: {
    params: { variationId: string };
  }): Promise<ApiResult<Variation, Failure>> {
    return undefined!;
  }

  @Post(':variationId/nutrients')
  @UseValidation('variationNutrient')
  async createNutrient(payload: {
    body: VariationNutrientCreate;
    params: { variationId: string };
  }): Promise<ApiResult<VariationNutrient, Failure>> {
    return undefined!;
  }

  @Patch(':variationId/nutrients/:variationNutrientId')
  @UseValidation('variationNutrient')
  async updateNutrient(payload: {
    body: VariationNutrientUpdate;
    params: { variationId: string; variationNutrientId: string };
  }): Promise<ApiResult<VariationNutrient, Failure>> {
    return undefined!;
  }

  @Delete(':variationId/nutrients/:variationNutrientId')
  @UseValidation('variationNutrient')
  async deleteNutrient(payload: {
    params: { variationId: string; variationNutrientId: string };
  }): Promise<ApiResult<VariationNutrient, Failure>> {
    return undefined!;
  }
}
