import { Failure } from './types';

export const getPropertyErrorDescriptionsFromFailure = (failure: Failure, path: Array<string>) => {
  return failure.error.message
    .filter(message => message.path.join('.') === path.join('.'))
    .map(({ description }) => description);
};
