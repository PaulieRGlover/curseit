import { Injectable } from '@angular/core';

import { errorResponseSchema } from '@/core/dtos/external/auth';

import { zodValidate } from '../../zod-validate.util';

@Injectable({ providedIn: 'root' })
export class AuthValidationService {
  get errorResponse() {
    return zodValidate<typeof errorResponseSchema>(errorResponseSchema);
  }
}
