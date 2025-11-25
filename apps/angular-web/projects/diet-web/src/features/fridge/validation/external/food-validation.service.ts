import { Injectable } from '@angular/core';

import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class FoodValidationService {
  public async food(input: unknown) {
    const schema = (await import('../../types/external/food.types')).food;
    return zodValidate(schema, input);
  }

  public async foodWithVariations(input: unknown) {
    const schema = (await import('../../types/external/food.types')).foodWithVariations;
    return zodValidate(schema, input);
  }

  public async foodsWithPortions(input: unknown) {
    const schema = (await import('../../types/external/food.types')).foodsWithPortions;
    return zodValidate(schema, input);
  }
}
