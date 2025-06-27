import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AuthValidationService {
  private util = import('../../zod-validate.util');

  public async idTokenPayload(input: any) {
    const schema = (await import('@/core/dtos/external/id-token-payload.dto')).idTokenPayloadSchema;
    return (await this.util).zodValidate(schema, input);
  }

  public async errorResponse(input: any) {
    const schema = (await import('@/core/dtos/external/auth-error-response.dto'))
      .errorResponseSchema;
    return (await this.util).zodValidate(schema, input);
  }

  public async successResponse(input: any) {
    const schema = (await import('@/core/dtos/external/auth-success-response.dto'))
      .successResponseSchema;
    return (await this.util).zodValidate(schema, input);
  }
}
