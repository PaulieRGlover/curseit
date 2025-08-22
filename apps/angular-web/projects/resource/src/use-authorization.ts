import {
  AUTHORIZATION_TOKEN_KEY,
  USE_AUTHORIZATION,
} from './constants';

export function UseAuthorization(
  options: string = '_accessToken',
): MethodDecorator & ClassDecorator {
  return (
    target: any,
    key?: string | symbol,
  ) => {
    if (typeof key === 'undefined') {
      Reflect.defineMetadata(USE_AUTHORIZATION, true, target);
      Reflect.defineMetadata(AUTHORIZATION_TOKEN_KEY, options, target);
    } else {
      Reflect.defineMetadata(USE_AUTHORIZATION, true, target, key);
      Reflect.defineMetadata(AUTHORIZATION_TOKEN_KEY, options, target, key);
    }
  };
}
