import { convertFromGrams } from '@curseit/units';

import { NutrientModel, NutrientInput } from '../types/variation-nutrient.types';

export const nutrientInputToNutrientModel = (
  nutrientInput: NutrientInput,
): NutrientModel => {
  return {
    core: nutrientInput.nutrientId ? {
      id: nutrientInput.nutrientId,
      name: nutrientInput.name,
    } : null,
    amountValue: convertFromGrams(nutrientInput.valueDisplayUnit, nutrientInput.valueInGrams),
    amountUnit: nutrientInput.valueDisplayUnit,
  };
};
