import { convertToGrams } from '@curseit/units';

import { VariationNutrientUpdate } from '@/features/fridge/types/internal/variation.types';

import { Nutrient } from '../types/variation-nutrient.types';

export const nutrientToVariationNutrientUpdate = (nutrient: Nutrient): VariationNutrientUpdate => {
  const [value, unit] = nutrient.amount;

  return {
    name: nutrient.core?.name,
    valueInGrams: convertToGrams(unit, value),
    valueDisplayUnit: unit,
    nutrientId: nutrient.core?.id,
  };
};
