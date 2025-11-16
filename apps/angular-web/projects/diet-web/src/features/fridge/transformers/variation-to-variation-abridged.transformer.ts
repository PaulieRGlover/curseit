import { Variation, VariationAbridged } from '../types/external/food.types';

export const variationToVariationAbridged = (variation: Variation): VariationAbridged => {
  return {
    id: variation.id,
    name: variation.name,
  };
};
