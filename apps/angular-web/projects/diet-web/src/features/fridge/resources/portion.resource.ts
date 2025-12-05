import { Injectable, inject } from '@angular/core';

import {
  ApiResult,
  Delete,
  Patch,
  Post,
  Resource,
  UseAuthorization,
  UseValidation,
} from '@curseit/resource';

import { DietResource } from '@/core/diet.resource';
import { Failure } from '@/core/types/external/failure.types';

import { Portion, Portions } from '../types/external/portion.types';
import { PortionUpdate, PortionsCreate } from '../types/internal/portion.types';
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

  @Delete(':portionId')
  @UseValidation('portion')
  async delete(payload: { params: { portionId: string } }): Promise<ApiResult<Portion, Failure>> {
    return undefined!;
  }

  @Post('action/bulk-create')
  @UseValidation('portions')
  async bulkCreate(payload: { body: PortionsCreate }): Promise<ApiResult<Portions, Failure>> {
    return undefined!;
  }

  @Post('action/bulk-delete')
  @UseValidation('portions')
  async bulkDelete(payload: {
    body: { ids: Array<Portion['id']> };
  }): Promise<ApiResult<Portions, Failure>> {
    return undefined!;
  }
}
