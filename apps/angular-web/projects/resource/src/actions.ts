import { HttpClient } from '@angular/common/http';
import type { Signal } from '@angular/core';

import { Observable, firstValueFrom } from 'rxjs';

import type { MaybeUndefined } from '@curseit/types';

import {
  AUTHORIZATION_TOKEN_KEY,
  PATH,
  USE_AUTHORIZATION,
  VALIDATION_FAILURE,
  VALIDATION_SUCCESS,
} from './constants';
import { ApiResult } from './types';

type ValidationService = {
  [k: string]: MaybeUndefined<(input: unknown) => any>;
};

type AuthService = {
  isAuthenticated: Signal<boolean>;
  _isAuthenticated$: Observable<boolean>;
  [k: string]: any;
};

type RequestOptions = {
  headers: Record<string, string>;
  withCredentials: true;
};

type Method = 'get' | 'post' | 'put' | 'patch' | 'options' | 'delete';

const ERRORS = {
  NO_HTTP_CLIENT: 'No HttpClient injected. Please, inject HttpClient.',
  NO_PARAMS: (params: Array<string>) =>
    `No params passed in arguments. Missing params: ${params.join(', ')}`,
  NO_AUTH_SERVICE: 'No AuthService injected. Please, inject AuthService.',
  NO_TOKEN: (key: any) => `No token by address this[${key}] or this.authService[${key}]`,
  AUTH_SERVICE_FAILURE: 'AuthService failed to authenticate, so the API cannot be accessed.',
  API_VALIDATION_FAILED: (error: any) => `API result validation failed: ${error}`,
  NO_VALIDATOR: (key: any) => `No validator by address this.validation[${key}]`,
  API_ERROR_VALIDATION_FAILED: (error: any) => `API error validation failed: ${error}`,
} as const;

const getToken = async (authService: MaybeUndefined<AuthService>, tokenKey: string) => {
  if (!authService) {
    reportError(ERRORS.NO_AUTH_SERVICE);

    throw ERRORS.NO_AUTH_SERVICE;
  }

  if (!authService.isAuthenticated()) {
    try {
      await new Promise((resolve, reject) => {
        setTimeout(reject, 5000);

        authService?._isAuthenticated$.subscribe(value => {
          if (value) {
            resolve(value);
          }
        });
      });
    } catch (error) {
      reportError(ERRORS.AUTH_SERVICE_FAILURE);

      throw ERRORS.AUTH_SERVICE_FAILURE;
    }
  }

  let token: MaybeUndefined<string>;
  if (tokenKey) {
    token = authService[tokenKey]?.();
  }

  if (!token || typeof token !== 'string') {
    reportError(ERRORS.NO_TOKEN(tokenKey));

    throw new Error(ERRORS.NO_TOKEN(tokenKey));
  } else {
    return token;
  }
};

export const createAction = (method: Method) => {
  return function (path: string): MethodDecorator {
    return function (target, propertyKey, descriptor: PropertyDescriptor) {
      const reportError = (error: unknown) => {
        console.error(`At ${target.constructor.name}, in ${propertyKey.toString()}`);
        console.error(error);
      };

      descriptor.value = async function (
        this: {
          http?: HttpClient,
          validation?: ValidationService,
          authService?: AuthService,
        },
        payload?: {
          body: any,
          query?: Record<string, string | number>,
          params?: Record<string, string | number>,
          authToken?: string,
        },
      ): ApiResult<any, any> {
        let processedPath = path;
        if (!this.http) {
          reportError(ERRORS.NO_HTTP_CLIENT);

          throw ERRORS.NO_HTTP_CLIENT;
        }

        const base = Reflect.getMetadata(PATH, target.constructor) ?? '/';
        const paramsFromPath = path.match(/:\w+/g)?.map(paramKey => paramKey.replace(/^:/, ''));
        if (paramsFromPath?.length && payload?.params) {
          const missingParams = paramsFromPath.filter(paramKey => {
            return (
              typeof payload?.params![paramKey] !== 'string' &&
              typeof payload?.params![paramKey] !== 'number'
            );
          });

          if (missingParams.length) {
            reportError(ERRORS.NO_PARAMS(missingParams));
          }

          paramsFromPath.forEach(paramKey => {
            processedPath = processedPath.replace(
              new RegExp(`:${paramKey}`),
              payload?.params![paramKey].toString(),
            );
          });
        }

        let fullPath = `${base}/${processedPath}`.replace(/\/$/, '');

        const query = Object.keys(payload?.query ?? {})
          .filter(key => payload!.query![key] !== undefined)
          .map(key => [key, payload!.query![key]]);
        if (query.length) {
          fullPath += '?' + query.map(([key, value]) => `${key}=${value}`).join('&');
        }

        const requestOptions: RequestOptions = {
          headers: {},
          withCredentials: true,
        };

        const useAuthorization =
          Reflect.getMetadata(USE_AUTHORIZATION, target, propertyKey) ||
          Reflect.getMetadata(USE_AUTHORIZATION, target.constructor);
        if (useAuthorization) {
          const tokenKey =
            Reflect.getMetadata(AUTHORIZATION_TOKEN_KEY, target, propertyKey) ||
            Reflect.getMetadata(AUTHORIZATION_TOKEN_KEY, target.constructor);

          const token = payload?.authToken ?? await getToken(this.authService, tokenKey);

          requestOptions.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
          let request;
          switch (method) {
            case 'get': {
              request = this.http.get(fullPath, requestOptions);
              break;
            }
            case 'post': {
              request = this.http.post(fullPath, payload?.body, requestOptions);
              break;
            }
            case 'put': {
              request = this.http.put(fullPath, payload?.body, requestOptions);
              break;
            }
            case 'patch': {
              request = this.http.patch(fullPath, payload?.body, requestOptions);
              break;
            }
            case 'delete': {
              request = this.http.delete(fullPath, requestOptions);
              break;
            }
            case 'options': {
              request = this.http.options(fullPath, requestOptions);
              break;
            }
          }

          let result = await firstValueFrom(request);

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
    };
  };
};

export const Post = createAction('post');

export const Get = createAction('get');

export const Put = createAction('put');

export const Patch = createAction('patch');

export const Options = createAction('options');

export const Delete = createAction('delete');
