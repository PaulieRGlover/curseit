import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { Nullable } from '@curseit/types';

import { CookieService } from '@/core/browser/cookie.service';
import { API } from '@/core/constants/api.constants';
import type { IdTokenPayload } from '@/core/dtos/external/id-token-payload.dto';
import { JwtService } from '@/core/jwt/jwt.service';
import { GENERAL_MESSAGES } from '@/core/messages/general.messages';
import { AuthValidationService } from '@/core/validation/external/auth/auth-validation.service';
import { environment } from '@/environments/environment';

import { ID_TOKEN_COOKIE_NAME } from './constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private jwtService = inject(JwtService);
  private authValidationService = inject(AuthValidationService);

  public readonly isAuthenticatedUnsafe = computed(() => Boolean(this._idToken()));
  public readonly isAuthenticated = computed(() => Boolean(this._idTokenDecoded()));
  public readonly idTokenDecoded = computed(() => this._idTokenDecoded());

  async initialize() {
    const idToken = this.cookieService.getCookie(ID_TOKEN_COOKIE_NAME);

    if (idToken) {
      this._idToken.set(idToken);

      const [, idTokenDecoded] = await Promise.all([this.refresh(), this.decodeIdToken(idToken)]);

      this._idTokenDecoded.set(idTokenDecoded);
    }
  }

  async refresh() {
    const response = await firstValueFrom(this.http.get(API.REFRESH));

    const successResponse = await this.authValidationService.successResponse(response);
    if (successResponse) {
      this._accessToken.set(successResponse.access_token);
    }
  }

  async signUp(login: string, password: string) {
    const response = await firstValueFrom(this.http.post(API.SIGN_UP, { login, password }));

    const successResponse = await this.authValidationService.successResponse(response);
    if (!successResponse) {
      throw new Error(GENERAL_MESSAGES.API_RESPONSE_INVALID);
    }

    this._accessToken.set(successResponse.access_token);

    await this.handleIdToken();
  }

  async signIn(login: string, password: string) {
    const response = await firstValueFrom(this.http.post(API.SIGN_IN, { login, password }));

    const successResponse = await this.authValidationService.successResponse(response);
    if (!successResponse) {
      throw new Error(GENERAL_MESSAGES.API_RESPONSE_INVALID);
    }

    this._accessToken.set(successResponse.access_token);

    await this.handleIdToken();
  }

  async signOut() {
    try {
      await firstValueFrom(
        this.http.post(API.SIGN_OUT, {}, { headers: { Auth: `Bearer ${this._idToken}` } }),
      );
    } catch (_error) {}

    this._accessToken.set(null);
    this._idToken.set(null);
    this._idTokenDecoded.set(null);
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
}
