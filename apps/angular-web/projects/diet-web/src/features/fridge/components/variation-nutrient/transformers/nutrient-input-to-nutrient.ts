import { convertFromGrams } from '@curseit/units';

import { Nutrient, NutrientInput } from '../types/variation-nutrient.types';

export const nutrientInputToNutrient = (
  nutrientInput: NutrientInput,
): Nutrient => {
  return {
    core: nutrientInput.nutrientId ? {
      id: nutrientInput.nutrientId,
      name: nutrientInput.name,
    } : null,
    amount: [
      convertFromGrams(nutrientInput.valueDisplayUnit, nutrientInput.valueInGrams),
      nutrientInput.valueDisplayUnit,
    ],
  };
};
