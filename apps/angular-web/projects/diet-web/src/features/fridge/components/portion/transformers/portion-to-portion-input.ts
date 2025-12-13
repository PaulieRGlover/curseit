import { Portion } from '@/features/fridge/types/external/portion.types';
import { PortionModel } from '../types/portion.types';
import { VariationsAbridged } from '@/features/fridge/types/external/variation.types';
import { convertFromGrams } from '@curseit/units';

export const portionToPortionModel = (
  portion: Portion,
  variations: VariationsAbridged,
): PortionModel => {
  const variation = variations.find(variation => variation.id === portion.variationId);
  if (!variation) {
    throw new Error(`could not find variation of a portion: ${portion.id}`);
  }

  return {
    variation,
    dateAdded: new Date(portion.dateAdded),
    dateExpiring: portion.dateExpiring ? new Date(portion.dateExpiring) : null,
    portionSize: [
      convertFromGrams(portion.sizeDisplayUnit, portion.sizeInGrams),
      portion.sizeDisplayUnit,
    ],
    remaining: [
      convertFromGrams(portion.remainingDisplayUnit, portion.remainingInGrams),
      portion.remainingDisplayUnit,
    ],
  };
};
