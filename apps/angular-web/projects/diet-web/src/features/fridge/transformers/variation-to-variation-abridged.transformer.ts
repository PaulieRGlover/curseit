import { Variation, VariationAbridged } from '../types/external/variation.types';

export const variationToVariationAbridged = (variation: Variation): VariationAbridged => {
  return {
    id: variation.id,
    name: variation.name,
  };
};
