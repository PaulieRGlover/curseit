import { Injectable } from '@angular/core';

import { zodValidate } from '@/core/validation/zod-validate.util';

@Injectable({ providedIn: 'root' })
export class AuthExternalValidationService {
  public async idTokenPayload(input: any) {
    const schema = (await import('../types/external/id-token-payload.types')).idTokenPayloadSchema;
    return zodValidate(schema, input);
  }

  public async success(input: any) {
    const schema = (await import('../types/external/success.types')).successSchema;
    return zodValidate(schema, input);
  }

  public async failure(input: any) {
    const schema = (await import('@curseit/resource')).failure;
    return zodValidate(schema, input);
  }

  public async signOut(input: any) {
    const schema = (await import('../types/external/sign-out.types')).signOutSchema;
    return zodValidate(schema, input);
  }
}
