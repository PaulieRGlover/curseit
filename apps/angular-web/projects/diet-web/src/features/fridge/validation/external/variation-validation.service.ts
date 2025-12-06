import { Injectable } from '@angular/core';

import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class VariationValidationService {
  public async failure(input: any) {
    const schema = (await import('@curseit/resource')).failure;
    return zodValidate(schema, input);
  }

  public async variations(input: unknown) {
    const schema = (await import('../../types/external/variation.types')).variations;
    return zodValidate(schema, input);
  }

  public async variation(input: unknown) {
    const schema = (await import('../../types/external/variation.types')).variation;
    return zodValidate(schema, input);
  }

  public async variationWithNutrients(input: unknown) {
    const schema = (await import('../../types/external/variation.types')).variationWithNutrients;
    return zodValidate(schema, input);
  }

  public async variationNutrient(input: unknown) {
    const schema = (await import('../../types/external/variation.types')).variationNutrient;
    return zodValidate(schema, input);
  }
}
