import { convertToGrams } from '@curseit/units';

import { VariationNutrientUpdate } from '@/features/fridge/types/internal/variation.types';

import { NutrientModel } from '../types/variation-nutrient.types';

export const nutrientModelToVariationNutrientUpdate = (
  nutrient: NutrientModel,
): VariationNutrientUpdate => {
  return {
    name: nutrient.core?.name,
    valueInGrams: convertToGrams(nutrient.amountUnit, nutrient.amountValue),
    valueDisplayUnit: nutrient.amountUnit,
    nutrientId: nutrient.core?.id,
  };
};
