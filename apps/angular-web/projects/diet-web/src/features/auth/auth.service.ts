import { HttpClient } from '@angular/common/http';
import { DOCUMENT, Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { Nullable } from '@curseit/types';

import { GENERAL_MESSAGES } from '@/core/messages/general.messages';
import { AuthValidationService } from '@/core/validation/external/auth/auth-validation.service';
import { API } from '@/core/constants/api.constants';
import { CookieService } from '@/core/browser/cookie.service';
import { JwtService } from '@/core/jwt/jwt.service';

type IdToken {
  
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private cookieService: CookieService,
    private jwtService: JwtService,
    private authValidationService: AuthValidationService,
  ) {}

  private http = inject(HttpClient);
  private _accessToken: Nullable<string> = null;
  private _idToken: Nullable<IdToken

  public get accessToken() {
    return this._accessToken;
  }

  public set accessToken(token: Nullable<string>) {
    this._accessToken = token;
  }

  async initialize() {
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
  }

  async signIn(login: string, password: string) {
    const response = await firstValueFrom(this.http.post(API.SIGN_IN, { login, password }));

    const successResponse = this.authValidationService.successResponse(response);
    if (!successResponse) {
      throw new Error(GENERAL_MESSAGES.API_RESPONSE_INVALID);
    }

    this.accessToken = successResponse.access_token;
  }
}
