import { convertFromGrams, convertToGrams } from '@curseit/units';

import { VariationNutrient } from '../dto/external/food.dto';
import { NutrientCreate, NutrientInput } from '../dto/internal/nutrient.dto';

export const nutrientToNutrientInput = (nutrient: VariationNutrient): NutrientInput => {
  return {
    id: nutrient.id,
    name: nutrient.name,
    value: convertFromGrams(nutrient.valueDisplayUnit, nutrient.valueInGrams),
    unit: nutrient.valueDisplayUnit,
  };
};

export const nutrientInputToNutrientCreate = (nutrientInput: NutrientInput): NutrientCreate => {
  return {
    name: nutrientInput.name,
    valueInGrams: convertToGrams(nutrientInput.unit, nutrientInput.value),
    valueDisplayUnit: nutrientInput.unit,
  };
};
