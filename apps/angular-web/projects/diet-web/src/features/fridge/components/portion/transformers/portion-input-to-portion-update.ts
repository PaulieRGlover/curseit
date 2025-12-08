import { convertToGrams } from '@curseit/units';

import { PortionUpdate } from '@/features/fridge/types/internal/portion.types';

import { PortionInput } from '../types/portion.types';

export const portionInputToPortionUpdate = (
  portionInput: PortionInput,
): PortionUpdate => {
  const [portionSize, portionSizeDisplayUnit] = portionInput.portionSize;
  const [remainingSize, remainingDisplayUnit] = portionInput.remaining;

  const update: PortionUpdate = {
    variationId: portionInput.variation.id,
    dateAdded: portionInput.dateAdded.toISOString(),
    sizeInGrams: convertToGrams(portionSizeDisplayUnit, portionSize),
    sizeDisplayUnit: portionSizeDisplayUnit,
    remainingInGrams: convertToGrams(remainingDisplayUnit, remainingSize),
    remainingDisplayUnit: remainingDisplayUnit,
  };

  if (portionInput.dateExpiring instanceof Date && !isNaN(portionInput.dateExpiring.getTime())) {
    update.dateExpiring = portionInput.dateExpiring.toISOString();
  } else if (portionInput.dateExpiring === null) {
    update.dateExpiring = null;
  }

  return update;
};
