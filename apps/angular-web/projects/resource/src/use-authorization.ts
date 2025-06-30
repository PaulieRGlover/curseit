import {
  AUTHORIZATION_TOKEN_FROM_BODY,
  AUTHORIZATION_TOKEN_KEY,
  USE_AUTHORIZATION,
} from './constants';

export function UseAuthorization(options: string | { fromBody: true }): MethodDecorator {
  return function (target, propertyKey) {
    Reflect.defineMetadata(USE_AUTHORIZATION, true, target, propertyKey);
    if (typeof options === 'string') {
      Reflect.defineMetadata(AUTHORIZATION_TOKEN_KEY, options, target, propertyKey);
    } else {
      Reflect.defineMetadata(AUTHORIZATION_TOKEN_FROM_BODY, options, target, propertyKey);
    }
  };
}
