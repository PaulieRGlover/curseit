import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtService {
  private jose = import('jose');

  public async read(
    token: string,
    secret: string,
  ): Promise<unknown | null> {
    const { jwtVerify } = await this.jose;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    return payload;
  }
}
