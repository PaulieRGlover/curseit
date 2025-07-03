import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ApiResult, Get, Post, Resource, UseAuthorization, UseValidation } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { Failure } from '@/core/dtos/external/failure.dto';

import { API } from './auth.constants';
import { Success } from './dtos/success.dto';
import { AuthExternalValidationService } from './validation/auth-external-validation.service';

export type AuthApiResult = ApiResult<Success, Failure>;

@Injectable({ providedIn: 'root' })
@Resource(API.BASE)
export class AuthResource {
  http = inject(HttpClient);
  validation = inject(AuthExternalValidationService);

  @Post(API.SIGN_UP)
  @UseValidation()
  async signUp(body: { login: string; password: string }): AuthApiResult {
    return undefined!;
  }

  @Post(API.SIGN_IN)
  @UseValidation()
  async signIn(body: { login: string; password: string }): AuthApiResult {
    return undefined!;
  }

  @Get(API.REFRESH)
  async refresh(): AuthApiResult {
    return undefined!;
  }

  @Post(API.SIGN_OUT)
  @UseAuthorization({ fromBody: true })
  async signOut(token: Nullable<string>): ApiResult<{}, Failure> {
    return undefined!;
  }
}
