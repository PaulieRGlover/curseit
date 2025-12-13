import { convertToGrams } from '@curseit/units';

import { PortionUpdate } from '@/features/fridge/types/internal/portion.types';

import { PortionModel } from '../types/portion.types';

export const portionModelToPortionUpdate = (
  portionModel: PortionModel,
): PortionUpdate => {
  const [portionSize, portionSizeDisplayUnit] = portionModel.portionSize;
  const [remainingSize, remainingDisplayUnit] = portionModel.remaining;

  const update: PortionUpdate = {
    variationId: portionModel.variation.id,
    dateAdded: portionModel.dateAdded.toISOString(),
    sizeInGrams: convertToGrams(portionSizeDisplayUnit, portionSize),
    sizeDisplayUnit: portionSizeDisplayUnit,
    remainingInGrams: convertToGrams(remainingDisplayUnit, remainingSize),
    remainingDisplayUnit: remainingDisplayUnit,
  };

  if (portionModel.dateExpiring instanceof Date && !isNaN(portionModel.dateExpiring.getTime())) {
    update.dateExpiring = portionModel.dateExpiring.toISOString();
  } else if (portionModel.dateExpiring === null) {
    update.dateExpiring = null;
  }

  return update;
};
