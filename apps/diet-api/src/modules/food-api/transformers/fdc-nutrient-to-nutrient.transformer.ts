import { Nullable } from '@curseit/types';

import { NutrientInFood } from '../dto/nutrients.dto';
import { FDC_UNIT_NAME, FdcFoodNutrientAbridged } from '../modules/fdc/external/fdc.types';

import { fdcNutrientValueToNutrientValueInGrams } from './fdc-nutrient-value-to-nutrient-value-in-grams';
import { NUTRIENT_SHORT_NAME_MAP } from './nutrient-name-map';

export const fdcNutrientToNutrient = (
  nutrient: FdcFoodNutrientAbridged,
): Nullable<NutrientInFood> => {
  if (
    ([
      FDC_UNIT_NAME.IU,
      FDC_UNIT_NAME.KCAL,
      FDC_UNIT_NAME.KJ,
      FDC_UNIT_NAME.MG_ATE,
    ] as string[]).includes(nutrient.unitName)
  ) {
    return null;
  }

  const shortName = NUTRIENT_SHORT_NAME_MAP.get(nutrient.nutrientName);

  return {
    name: nutrient.nutrientName,
    shortName,
    valueInGrams: fdcNutrientValueToNutrientValueInGrams(nutrient.value, nutrient.unitName),
  };
};
