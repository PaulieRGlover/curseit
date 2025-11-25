import { zodValidate } from '@/core/validation/zod-validate.util';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NutrientValidationService {
  public async nutrientsAbridged(input: unknown) {
    const schema = (await import('../../types/external/nutrient.types')).nutrientsAbridged;
    return zodValidate(schema, input);
  }
}
