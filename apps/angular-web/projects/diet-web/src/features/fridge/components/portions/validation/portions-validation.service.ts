import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';

@Injectable({ providedIn: 'root' })
export class PortionsValidationService {
  public async createPortionsCount(control: AbstractControl) {
    const schema = (await import('../types/portions.types')).createPortionsCount;
    return zodValidateForFormControl(schema, control);
  }
}
