import { convertToGrams } from '@curseit/units';

import { VariationNutrientListItemUpdate } from '../../variation-nutrients/types/variation-nutrient-list-item.types';
import { VariationNutrientInputUpdate } from '../types/variation-nutrient-input.types';

export const variationNutrientInputUpdateToVariationNutrientListItemUpdate = (
  variationNutrientInput: VariationNutrientInputUpdate,
): VariationNutrientListItemUpdate => {
  const [value, unit] = variationNutrientInput.amount;

  return {
    name: variationNutrientInput.name,
    valueInGrams: convertToGrams(unit, value),
    valueDisplayUnit: unit,
    nutrientId: variationNutrientInput.nutrientId,
  };
};
