import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthExternalValidationService {
  public async idTokenPayload(input: any) {
    const schema = (await import('../types/external/id-token-payload.types')).idTokenPayloadSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }

  public async success(input: any) {
    const schema = (await import('../types/external/success.types')).successSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }

  public async failure(input: any) {
    const schema = (await import('@/core/types/external/failure.types')).failureSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }

  public async signOut(input: any) {
    const schema = (await import('../types/external/sign-out.types')).signOutSchema;
    return (await import('@/core/validation/zod-validate.util')).zodValidate(schema, input);
  }
}
