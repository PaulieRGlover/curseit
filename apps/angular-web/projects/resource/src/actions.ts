import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import type { MaybeUndefined } from '@curseit/types';
import { ApiResult } from './types';
import {
  AUTHORIZATION_TOKEN_FROM_BODY,
  AUTHORIZATION_TOKEN_KEY,
  PATH,
  USE_AUTHORIZATION,
  VALIDATION_FAILURE,
  VALIDATION_SUCCESS,
} from './constants';

type ValidationService = {
  [k: string]: MaybeUndefined<(input: unknown) => any>,
};

type AuthService = {
  [k: string]: string,
};

type Method = 'get' | 'post' | 'patch' | 'options' | 'delete';

const ERRORS = {
  NO_HTTP_CLIENT: `No HttpClient injected. Please, inject HttpClient.`,
  NO_TOKEN: (key: any) => `No token by address this[${key}] or this.authService[${key}]`,
  API_VALIDATION_FAILED: (error: any) => `API result validation failed: ${error}`,
  NO_VALIDATOR: (key: any) => `No validator by address this.validation[${key}]`,
  API_ERROR_VALIDATION_FAILED: (error: any) => `API error validation failed: ${error}`,
} as const;

export const createAction = (method: Method) => {
  return function(path: string): MethodDecorator {
    return function(target, propertyKey, descriptor: PropertyDescriptor) {
      const reportError = (error: unknown) => {
        console.error(`At ${target.constructor.name}, in ${propertyKey.toString()}`);
        console.error(error);
      };

      descriptor.value = async function (
        this: {
          http?: HttpClient,
          validation?: ValidationService,
          authService?: AuthService,
          [key: string]: any,
        },
        body: any = {},
      ): ApiResult<any, any> {
        if (!this.http) {
          reportError(ERRORS.NO_HTTP_CLIENT);

          throw ERRORS.NO_HTTP_CLIENT;
        }

        const base = Reflect.getMetadata(PATH, target.constructor) ?? '/';
        const fullPath = `${base}/${path}`;

        const options = {
          headers: ({} as Record<string, string>),
          withCredentials: true,
        };

        const useAuthorization = Reflect.getMetadata(USE_AUTHORIZATION, target, propertyKey);
        if (useAuthorization) {
          const tokenKey = Reflect.getMetadata(AUTHORIZATION_TOKEN_KEY, target, propertyKey);
          const tokenFromBody = Reflect.getMetadata(
            AUTHORIZATION_TOKEN_FROM_BODY,
            target,
            propertyKey,
          );
          let token: MaybeUndefined<string>;
          if (tokenFromBody) {
            token = body;
            body = undefined;
          } else if (tokenKey) {
            token = this.authService?.[tokenKey] ??
            typeof this[tokenKey] === 'string'
              ? this[tokenKey]
              : null;
          }

          if (!token) {
            reportError(ERRORS.NO_TOKEN(tokenKey));
          } else {
            options.headers['Authorization'] = `Bearer ${token}`;
          }
        }

        try {
          let result = await firstValueFrom(
            method === 'delete'
              ? this.http[method](fullPath)
              : this.http[method](fullPath, body),
          );

          const validationName = Reflect.getMetadata(VALIDATION_SUCCESS, target, propertyKey);
          const validator = this.validation?.[validationName];
          if (validator) {
            try {
              result = await validator(result);
            } catch (error) {
              reportError(ERRORS.API_VALIDATION_FAILED(error));
            }
          } else if (validationName) {
            reportError(ERRORS.NO_VALIDATOR(validationName));
          }

          return { success: result };
        } catch (error) {
          const validationName = Reflect.getMetadata(VALIDATION_FAILURE, target, propertyKey);
          const validator = this.validation?.[validationName];
          if (validator) {
            try {
              error = await validator(error);
            } catch (error) {
              reportError(ERRORS.API_ERROR_VALIDATION_FAILED(error));
            }
          }

          return { failure: error };
        }
      };
    }
  }
}

export const Post = createAction('post');

export const Get = createAction('get');

export const Patch = createAction('patch');

export const Options = createAction('options');

export const Delete = createAction('delete');
