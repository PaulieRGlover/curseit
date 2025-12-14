import { convertToGrams } from '@curseit/units';

import { PortionUpdate } from '@/features/fridge/types/internal/portion.types';

import { PortionModel } from '../types/portion.types';

export const portionModelToPortionUpdate = (portionModel: PortionModel): PortionUpdate => {
  const update: PortionUpdate = {
    variationId: portionModel.variation.id,
    dateAdded: portionModel.dateAdded.toISOString(),
    sizeInGrams: convertToGrams(portionModel.portionSizeUnit, portionModel.portionSizeValue),
    sizeDisplayUnit: portionModel.portionSizeUnit,
    remainingInGrams: convertToGrams(portionModel.remainingUnit, portionModel.remainingValue),
    remainingDisplayUnit: portionModel.remainingUnit,
  };

  if (portionModel.dateExpiring instanceof Date && !isNaN(portionModel.dateExpiring.getTime())) {
    update.dateExpiring = portionModel.dateExpiring.toISOString();
  } else if (portionModel.dateExpiring === null) {
    update.dateExpiring = null;
  }

  return update;
};
