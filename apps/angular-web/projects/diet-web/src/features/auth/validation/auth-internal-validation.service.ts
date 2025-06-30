import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class AuthInternalValidationService {
  public async login(control: AbstractControl) {
    const schema = (await import('@/core/dtos/internal/login.dto')).loginSchema;
    return (
      await import('../../../core/validation/zod-validate-for-form-control.util')
    ).zodValidate(schema, control);
  }

  public async password(control: AbstractControl) {
    const schema = (await import('@/core/dtos/internal/password.dto')).passwordSchema;
    return (
      await import('../../../core/validation/zod-validate-for-form-control.util')
    ).zodValidate(schema, control);
  }

  public async passwordCreate(control: AbstractControl) {
    const schema = (await import('@/core/dtos/internal/password-create.dto')).passwordCreateSchema;
    return (
      await import('../../../core/validation/zod-validate-for-form-control.util')
    ).zodValidate(schema, control);
  }
}
