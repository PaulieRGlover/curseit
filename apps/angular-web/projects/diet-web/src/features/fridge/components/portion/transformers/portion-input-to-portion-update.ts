import { convertToGrams } from '@curseit/units';

import { PortionUpdate } from '@/features/fridge/types/internal/portion.types';

import { PortionInput } from '../types/portion.types';

export const portionInputToPortionUpdate = (
  portionInput: Omit<PortionInput, 'counter'>,
): PortionUpdate => {
  const [portionSize, portionSizeDisplayUnit] = portionInput.portionSize;

  const update: PortionUpdate = {
    variationId: portionInput.variation.id,
    dateAdded: portionInput.dateAdded.toISOString(),
    sizeInGrams: convertToGrams(portionSizeDisplayUnit, portionSize),
    sizeDisplayUnit: portionSizeDisplayUnit,
  };

  if (portionInput.dateExpiring) {
    update.dateExpiring = portionInput.dateExpiring.toISOString();
  }

  return update;
};
