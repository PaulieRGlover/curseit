import { Injectable } from '@angular/core';

import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class PortionValidationService {
  public async portions(input: unknown) {
    const schema = (await import('../../types/external/portion.types')).portions;
    return zodValidate(schema, input);
  }

  public async portion(input: unknown) {
    const schema = (await import('../../types/external/portion.types')).portion;
    return zodValidate(schema, input);
  }
}
