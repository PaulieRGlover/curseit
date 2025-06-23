import { Injectable } from '@angular/core';
import { zodValidate } from '../../zod-validate-for-form-control.util';
import { loginSchema, passwordCreateSchema, passwordSchema } from '@/core/dtos/internal/user.dto';

@Injectable({ providedIn: 'root' })
export class UserValidationService {
  get login() {
    return zodValidate(loginSchema);
  }

  get password() {
    return zodValidate(passwordSchema);
  }

  get passwordCreate() {
    return zodValidate(passwordCreateSchema);
  }
}
