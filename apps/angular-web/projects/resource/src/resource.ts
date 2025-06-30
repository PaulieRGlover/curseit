import { PATH } from './constants';

export function Resource(path = '/'): ClassDecorator {
  return target => Reflect.defineMetadata(PATH, path, target);
}
