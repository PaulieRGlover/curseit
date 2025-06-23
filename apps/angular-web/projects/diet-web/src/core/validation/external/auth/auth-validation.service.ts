import { Injectable } from '@angular/core';

import { errorResponseSchema, successResponseSchema } from '@/core/dtos/external/auth.dto';

import { zodValidate } from '../../zod-validate.util';

@Injectable({ providedIn: 'root' })
export class AuthValidationService {
  get errorResponse() {
    return zodValidate<typeof errorResponseSchema>(errorResponseSchema);
  }

  get successResponse() {
    return zodValidate<typeof successResponseSchema>(successResponseSchema);
  }
}
