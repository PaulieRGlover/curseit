import {
  AUTHORIZATION_TOKEN_FROM_BODY,
  AUTHORIZATION_TOKEN_KEY,
  USE_AUTHORIZATION,
} from './constants';

export type UseAuthorizationOptions = string | { fromBody: true }

export function UseAuthorization(
  options: UseAuthorizationOptions = '_accessToken',
): MethodDecorator & ClassDecorator {
  return (
    target: any,
    key?: string | symbol,
  ) => {
    if (typeof key === 'undefined') {
      Reflect.defineMetadata(USE_AUTHORIZATION, true, target);

      if (typeof options === 'string') {
        Reflect.defineMetadata(AUTHORIZATION_TOKEN_KEY, options, target);
      } else {
        Reflect.defineMetadata(AUTHORIZATION_TOKEN_FROM_BODY, true, target);
      }
    } else {
      Reflect.defineMetadata(USE_AUTHORIZATION, true, target, key);

      if (typeof options === 'string') {
        Reflect.defineMetadata(AUTHORIZATION_TOKEN_KEY, options, target, key);
      } else {
        Reflect.defineMetadata(AUTHORIZATION_TOKEN_FROM_BODY, true, target, key);
      }
    }
  };
}
