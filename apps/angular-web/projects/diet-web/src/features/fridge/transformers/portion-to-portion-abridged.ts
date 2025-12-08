import { Portion, PortionAbridged } from '../types/external/portion.types';

export const portionToPortionAbridged = (portion: Portion): PortionAbridged => {
  return {
    id: portion.id,
    variationId: portion.variationId,
    foodId: portion.foodId,
    counter: portion.counter,
    freshness: portion.freshness,
    sizeInGrams: portion.sizeInGrams,
    remainingInGrams: portion.remainingInGrams,
  };
};
