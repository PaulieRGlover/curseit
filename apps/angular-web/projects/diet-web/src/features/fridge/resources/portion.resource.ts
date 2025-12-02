import { Injectable, inject } from '@angular/core';

import { ApiResult, Patch, Resource, UseAuthorization, UseValidation } from '@curseit/resource';

import { DietResource } from '@/core/diet.resource';
import { Failure } from '@/core/types/external/failure.types';

import { Portion } from '../types/external/portion.types';
import { PortionUpdate } from '../types/internal/portion.types';
import { PortionValidationService } from '../validation/external/portion-validation.service';

@Injectable({ providedIn: 'root' })
@Resource('fridge/portions')
@UseAuthorization()
export class PortionResource extends DietResource {
  validation = inject(PortionValidationService);

  @Patch(':portionId')
  @UseValidation('portion')
  async update(payload: {
    params: { portionId: string };
    body: PortionUpdate;
  }): Promise<ApiResult<Portion, Failure>> {
    return undefined!;
  }
}
