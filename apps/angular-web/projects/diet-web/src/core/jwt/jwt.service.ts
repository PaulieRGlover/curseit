import { Injectable } from '@angular/core';

import { ZodMiniAny, z } from 'zod/v4-mini';

@Injectable({ providedIn: 'root' })
export class JwtService {
  private jwt = import('jsonwebtoken');

  async read<T extends ZodMiniAny>(
    token: string,
    secret: string,
    schema: T,
  ): Promise<z.infer<T> | null> {
    const { verify } = await this.jwt;
    const decoded = verify(token, secret);

    const result = schema.safeParse(decoded);
    if (result.error) {
      throw result.error;
    }

    return result.data;
  }
}
