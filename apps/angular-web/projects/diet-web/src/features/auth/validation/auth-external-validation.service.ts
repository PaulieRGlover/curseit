import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthExternalValidationService {
  public async idTokenPayload(input: any) {
    const schema = (await import('@/features/auth/dtos/id-token-payload.dto')).idTokenPayloadSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }

  public async success(input: any) {
    const schema = (await import('../dtos/success.dto')).successSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }

  public async failure(input: any) {
    const schema = (await import('@/core/dtos/external/failure.dto')).failureSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }
}
