import { CookPortions } from '@/core/events';

import { Portions } from '../types/external/portion.types';

export const portionsToCreateRecipeProjectFromPortions = (
  portions: Portions,
): CookPortions => {
  return portions.map(portion => {
    return {
      foodPortionId: portion.id,
      sizeInGrams: portion.sizeInGrams,
      sizeDisplayUnit: portion.sizeDisplayUnit,
      maximumSizeInGrams: portion.sizeInGrams,
    };
  });
};
