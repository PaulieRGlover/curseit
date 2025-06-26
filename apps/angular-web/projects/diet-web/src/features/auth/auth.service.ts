import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { Nullable } from '@curseit/types';

import { CookieService } from '@/core/browser/cookie.service';
import { API } from '@/core/constants/api.constants';
import { IdTokenPayload } from '@/core/dtos/external/auth.dto';
import { JwtService } from '@/core/jwt/jwt.service';
import { GENERAL_MESSAGES } from '@/core/messages/general.messages';
import { AuthValidationService } from '@/core/validation/external/auth/auth-validation.service';
import { ID_TOKEN_COOKIE_NAME } from './constants';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private jwtService = inject(JwtService);
  private authValidationService = inject(AuthValidationService);

  private _idToken: Nullable<string> = null;
  private _accessToken: Nullable<string> = null;
  private _idTokenPayload: Nullable<IdTokenPayload> = null;

  private get accessToken() {
    return this._accessToken;
  }

  private set accessToken(token: Nullable<string>) {
    this._accessToken = token;
  }

  private get idToken() {
    return this._idToken;
  }

  private set idToken(token: Nullable<string>) {
    this._idToken = token;
  }

  private get idTokenPayload() {
    return this._idTokenPayload;
  }

  private set idTokenPayload(payload: Nullable<IdTokenPayload>) {
    this._idTokenPayload = payload;
  }

  public get isAuthenticatedUnsafe(): boolean {
    return Boolean(this._idToken);
  }

  public get isAuthenticated(): boolean {
    return Boolean(this._idTokenPayload);
  }

  async initialize() {
    const idToken = this.cookieService.getCookie(ID_TOKEN_COOKIE_NAME);
    
    if (idToken) {
      this.idToken = idToken;

      const [, idTokenPayload] = await Promise.all([ 
        this.refresh(),
        this.decodeIdToken(idToken),
      ]);

      this.idTokenPayload = idTokenPayload;
    }
  }

  async refresh() {
    const response = await firstValueFrom(this.http.get(API.REFRESH));

    const successResponse = this.authValidationService.successResponse(response);
    if (successResponse) {
      this.accessToken = successResponse.access_token;
    }
  }

  async signUp(login: string, password: string) {
    const response = await firstValueFrom(this.http.post(API.SIGN_UP, { login, password }));

    const successResponse = this.authValidationService.successResponse(response);
    if (!successResponse) {
      throw new Error(GENERAL_MESSAGES.API_RESPONSE_INVALID);
    }

    this.accessToken = successResponse.access_token;

    await this.handleIdToken();
  }

  async signIn(login: string, password: string) {
    const response = await firstValueFrom(this.http.post(API.SIGN_IN, { login, password }));

    const successResponse = this.authValidationService.successResponse(response);
    if (!successResponse) {
      throw new Error(GENERAL_MESSAGES.API_RESPONSE_INVALID);
    }

    this.accessToken = successResponse.access_token;

    await this.handleIdToken();
  }

  async signOut() {
    try {
      await firstValueFrom(this.http.post(
        API.SIGN_OUT,
        {},
        { headers: { Auth: `Bearer ${this.idToken}` } },
      ));
    } catch (_error) {}

    this.accessToken = null;
    this.idToken = null;
  }

  private async handleIdToken() {
    const idToken = this.cookieService.getCookie(ID_TOKEN_COOKIE_NAME);

    if (idToken) {
      this.idToken = idToken;

      this.idTokenPayload = await this.decodeIdToken(idToken);
    }
  }

  private async decodeIdToken(token: string): Promise<IdTokenPayload> {
    const payload = await this.jwtService.read(token, environment.idJwtSecret);
    const idTokenPayload = this.authValidationService.idTokenPayload(payload);
    if (!idTokenPayload) {
      throw new Error(GENERAL_MESSAGES.ID_TOKEN_PAYLOAD_INVALID);
    }

    return idTokenPayload;
  }
}
