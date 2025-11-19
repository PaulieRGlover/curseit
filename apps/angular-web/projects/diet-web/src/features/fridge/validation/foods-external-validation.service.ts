import { Injectable } from '@angular/core';

import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class FoodsExternalValidationService {
  public async food(input: unknown) {
    const schema = (await import('../types/external/food.types')).food;
    return zodValidate(schema, input);
  }

  public async foodWithVariations(input: unknown) {
    const schema = (await import('../types/external/food.types')).foodWithVariations;
    return zodValidate(schema, input);
  }

  public async foodsWithPortions(input: unknown) {
    const schema = (await import('../types/external/food.types')).foodsWithPortions;
    return zodValidate(schema, input);
  }

  public async variations(input: unknown) {
    const schema = (await import('../types/external/food.types')).variations;
    return zodValidate(schema, input);
  }

  public async variation(input: unknown) {
    const schema = (await import('../types/external/food.types')).variation;
    return zodValidate(schema, input);
  }

  public async variationWithNutrients(input: unknown) {
    const schema = (await import('../types/external/food.types')).variationWithNutrients;
    return zodValidate(schema, input);
  }

  public async nutrientsAbridged(input: unknown) {
    const schema = (await import('../types/external/food.types')).nutrientsAbridged;
    return zodValidate(schema, input);
  }

  public async variationNutrient(input: unknown) {
    const schema = (await import('../types/external/food.types')).variationNutrient;
    return zodValidate(schema, input);
  }
}
