import { Injectable } from '@angular/core';
import { jwtVerify } from 'jose';

@Injectable({ providedIn: 'root' })
export class JwtService {
  async read(
    token: string,
    secret: string,
  ): Promise<unknown | null> {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    return payload;
  }
}
