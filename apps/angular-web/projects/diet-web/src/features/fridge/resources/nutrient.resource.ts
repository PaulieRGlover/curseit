import { Injectable, inject } from '@angular/core';

import {
  ApiResult,
  Get,
  Resource,
  UseAuthorization,
  UseValidation,
} from '@curseit/resource';

import { DietResource } from '@/core/diet.resource';
import { Failure } from '@/core/types/external/failure.types';

import { NutrientsAbridged } from '../types/external/nutrient.types';
import { NutrientValidationService } from '../validation/external/nutrient-validation.service';

@Injectable({ providedIn: 'root' })
@Resource('fridge/nutrients')
@UseAuthorization()
export class NutrientResource extends DietResource {
  validation = inject(NutrientValidationService);

  @Get('')
  @UseValidation('nutrientsAbridged')
  async get(
    payload: { query: { search?: string, noRepeatIn?: string } },
  ): Promise<ApiResult<NutrientsAbridged, Failure>> {
    return undefined!;
  }
}
