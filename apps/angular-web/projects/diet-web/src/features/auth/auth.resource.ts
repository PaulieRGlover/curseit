import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ApiResult, Get, Post, Resource, UseAuthorization, UseValidation } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { Failure } from '@/core/types/external/failure.types';

import { Success } from './types/external/success.types';
import { AuthExternalValidationService } from './validation/auth-external-validation.service';

export type AuthApiResult = ApiResult<Success, Failure>;

@Injectable({ providedIn: 'root' })
@Resource('auth')
export class AuthResource {
  http = inject(HttpClient);
  validation = inject(AuthExternalValidationService);

  @Post('sign-up')
  @UseValidation()
  async signUp(payload: { login: string; password: string }): AuthApiResult {
    return undefined!;
  }

  @Post('sign-in')
  @UseValidation()
  async signIn(payload: { login: string; password: string }): AuthApiResult {
    return undefined!;
  }

  @Get('refresh')
  @UseValidation()
  async refresh(): AuthApiResult {
    return undefined!;
  }

  @Post('sign-out')
  @UseAuthorization()
  @UseValidation('signOut')
  async signOut(
    payload: undefined,
    options: { authToken: Nullable<string> },
  ): ApiResult<{}, Failure> {
    return undefined!;
  }
}
