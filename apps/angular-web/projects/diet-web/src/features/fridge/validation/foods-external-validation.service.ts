import { Injectable } from '@angular/core';

import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class FoodsExternalValidationService {
  public async food(input: unknown) {
    const schema = (await import('../dto/external/food.dto')).foodSchema;
    return zodValidate(schema, input);
  }

  public async foodWithVariations(input: unknown) {
    const schema = (await import('../dto/external/food.dto')).foodWithVariationsSchema;
    return zodValidate(schema, input);
  }

  public async foodsWithPortions(input: unknown) {
    const schema = (await import('../dto/external/food.dto')).foodsWithPortionsSchema;
    return zodValidate(schema, input);
  }

  public async variationWithNutrients(input: unknown) {
    const schema = (await import('../dto/external/food.dto')).variationWithNutrientsSchema;
    return zodValidate(schema, input);
  }

  public async nutrients(input: unknown) {
    const schema = (await import('../dto/external/food.dto')).nutrientsSchema;
    return zodValidate(schema, input);
  }

  public async variationNutrient(input: unknown) {
    const schema = (await import('../dto/external/food.dto')).variationNutrientSchema;
    return zodValidate(schema, input);
  }
}
