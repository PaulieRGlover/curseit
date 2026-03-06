import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { Nullable } from '@curseit/types';

import { CookieService } from '@/core/browser/cookie.service';
import { JwtService } from '@/core/jwt/jwt.service';
import { GENERAL_MESSAGES } from '@/shared/messages/general.messages';
import { environment } from '@/environments/environment';

import { AuthApiResult, AuthResource } from './auth.resource';
import { ID_TOKEN_COOKIE_NAME } from './constants';
import type { IdTokenPayload } from './types/external/id-token-payload.types';
import { AuthExternalValidationService } from './validation/auth-external-validation.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private cookieService = inject(CookieService);
  private jwtService = inject(JwtService);
  private authValidationService = inject(AuthExternalValidationService);
  private authResource = inject(AuthResource);

  public readonly isAuthenticatedUnsafe = computed(() => Boolean(this._idToken()));
  public readonly isAuthenticated = computed(() => Boolean(this._idTokenDecoded()));
  public readonly idTokenDecoded = computed(() => this._idTokenDecoded());

  async initialize() {
    const idToken = this.cookieService.getCookie(ID_TOKEN_COOKIE_NAME);

    if (idToken) {
      this._idToken.set(idToken);

      const [refreshResult, idTokenDecoded] = await Promise.all([
        this.refresh(),
        this.decodeIdToken(idToken),
      ]);

      if (refreshResult.success) {
        this._idTokenDecoded.set(idTokenDecoded);
      }
    }
  }

  async refresh(): AuthApiResult {
    const result = await this.authResource.refresh();

    if (result.success) {
      this._accessToken.set(result.success.access_token);

      await this.handleIdToken();
    }

    return result;
  }

  async signUp(login: string, password: string): AuthApiResult {
    const result = await this.authResource.signUp({ body: { login, password } });

    if (result.success) {
      this._accessToken.set(result.success.access_token);

      await this.handleIdToken();
    }

    return result;
  }

  async signIn(login: string, password: string): AuthApiResult {
    const result = await this.authResource.signIn({ body: { login, password } });

    if (result.success) {
      this._accessToken.set(result.success.access_token);
      await this.handleIdToken();
    }

    return result;
  }

  async signOut() {
    const idToken = this._idToken();

    this._accessToken.set(null);
    this._idToken.set(null);
    this._idTokenDecoded.set(null);

    return this.authResource.signOut({ authToken: idToken });
  }

  private _idToken = signal<Nullable<string>>(null);
  private _accessToken = signal<Nullable<string>>(null);
  private _idTokenDecoded = signal<Nullable<IdTokenPayload>>(null);

  private async handleIdToken() {
    const idToken = this.cookieService.getCookie(ID_TOKEN_COOKIE_NAME);

    if (idToken) {
      this._idToken.set(idToken);

      this._idTokenDecoded.set(await this.decodeIdToken(idToken));
    }
  }

  private async decodeIdToken(token: string): Promise<IdTokenPayload> {
    const payload = await this.jwtService.read(token, environment.idJwtSecret);
    const idTokenPayload = await this.authValidationService.idTokenPayload(payload);
    if (!idTokenPayload) {
      throw new Error(GENERAL_MESSAGES.ID_TOKEN_PAYLOAD_INVALID);
    }

    return idTokenPayload;
  }

  // Only to be used in the resource decorator
  public _isAuthenticated$ = toObservable(this.isAuthenticated);
}
