import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthExternalValidationService {
  public async idTokenPayload(input: any) {
    const schema = (await import('@/features/auth/dto/external/id-token-payload.dto')).idTokenPayloadSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }

  public async success(input: any) {
    const schema = (await import('../dto/external/success.dto')).successSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }

  public async failure(input: any) {
    const schema = (await import('@/core/dto/external/failure.dto')).failureSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }
}
