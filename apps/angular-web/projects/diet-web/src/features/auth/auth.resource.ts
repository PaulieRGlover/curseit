import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ApiResult, Get, Post, Resource, UseAuthorization, UseValidation } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { Failure } from '@/core/dto/external/failure.dto';

import { Success } from './dto/external/success.dto';
import { AuthExternalValidationService } from './validation/auth-external-validation.service';
import { API } from '@/core/constants/api.constants';

export type AuthApiResult = ApiResult<Success, Failure>;

@Injectable({ providedIn: 'root' })
@Resource(API.AUTH.BASE)
export class AuthResource {
  http = inject(HttpClient);
  validation = inject(AuthExternalValidationService);

  @Post(API.AUTH.SIGN_UP)
  @UseValidation()
  async signUp(body: { login: string; password: string }): AuthApiResult {
    return undefined!;
  }

  @Post(API.AUTH.SIGN_IN)
  @UseValidation()
  async signIn(body: { login: string; password: string }): AuthApiResult {
    return undefined!;
  }

  @Get(API.AUTH.REFRESH)
  async refresh(): AuthApiResult {
    return undefined!;
  }

  @Post(API.AUTH.SIGN_OUT)
  @UseAuthorization({ fromBody: true })
  async signOut(token: Nullable<string>): ApiResult<{}, Failure> {
    return undefined!;
  }
}
