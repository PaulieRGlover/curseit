import { Injectable } from '@angular/core';

import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class NutrientValidationService {
  public async failure(input: any) {
    const schema = (await import('@curseit/resource')).failure;
    return zodValidate(schema, input);
  }

  public async nutrientsAbridged(input: unknown) {
    const schema = (await import('../../types/external/nutrient.types')).nutrientsAbridged;
    return zodValidate(schema, input);
  }
}
