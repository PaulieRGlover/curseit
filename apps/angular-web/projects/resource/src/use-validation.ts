import { VALIDATION_FAILURE, VALIDATION_SUCCESS } from './constants';

export function UseValidation(success = 'success', failure = 'failure'): MethodDecorator {
  return function(target, propertyKey) {
    Reflect.defineMetadata(VALIDATION_SUCCESS, success, target, propertyKey);
    Reflect.defineMetadata(VALIDATION_FAILURE, failure, target, propertyKey);
  }
}
