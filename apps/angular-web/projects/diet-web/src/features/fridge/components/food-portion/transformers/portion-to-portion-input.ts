import { Portion } from '@/features/fridge/types/external/portion.types';
import { PortionInput } from '../types/food-portion.types';
import { VariationsAbridged } from '@/features/fridge/types/external/variation.types';
import { convertFromGrams } from '@curseit/units';

export const portionToPortionInput = (
  portion: Portion,
  variations: VariationsAbridged,
): PortionInput => {
  const variation = variations.find(variation => variation.id === portion.variationId);
  if (!variation) {
    throw new Error(`could not find variation of a portion: ${portion.id}`);
  }

  return {
    variation,
    counter: portion.counter,
    dateAdded: new Date(portion.dateAdded),
    dateExpiring: portion.dateExpiring ? new Date(portion.dateExpiring) : null,
    portionSize: [
      convertFromGrams(portion.sizeDisplayUnit, portion.sizeInGrams),
      portion.sizeDisplayUnit,
    ],
  };
};
