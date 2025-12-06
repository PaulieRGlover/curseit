import { Failure, getPropertyErrorDescriptionsFromFailure } from '@curseit/resource';

import { Portion, PortionErrors } from '../types/external/portion.types';

export const failureToPortionErrors = (
  failure: Failure,
  portionId: Portion['id'],
): PortionErrors => {
  const dateExpiring = getPropertyErrorDescriptionsFromFailure(failure, ['dateExpiring']);

  return {
    id: portionId,
    dateExpiring,
  };
};
