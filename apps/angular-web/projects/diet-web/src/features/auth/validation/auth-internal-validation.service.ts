import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';

@Injectable({ providedIn: 'root' })
export class AuthInternalValidationService {
  public async login(control: AbstractControl) {
    const schema = (await import('../dto/internal/login.dto')).loginSchema;
    return zodValidateForFormControl(schema, control);
  }

  public async password(control: AbstractControl) {
    const schema = (await import('../dto/internal/password.dto')).passwordSchema;
    return zodValidateForFormControl(schema, control);
  }

  public async passwordCreate(control: AbstractControl) {
    const schema = (await import('../dto/internal/password-create.dto')).passwordCreateSchema;
    return zodValidateForFormControl(schema, control);
  }
}
