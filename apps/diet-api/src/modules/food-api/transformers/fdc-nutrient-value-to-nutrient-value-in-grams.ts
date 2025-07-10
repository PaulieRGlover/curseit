import { NutrientInFood } from '../dto/nutrients.dto';
import { FDC_UNIT_NAME, FdcFoodNutrientAbridged } from '../modules/fdc/external/fdc.types';

export const fdcNutrientValueToNutrientValueInGrams = (
  value: FdcFoodNutrientAbridged['value'] = 0,
  unitName: FdcFoodNutrientAbridged['unitName'],
): NutrientInFood['valueInGrams'] => {
  switch (unitName) {
    case FDC_UNIT_NAME.G: {
      return value;
    }
    case FDC_UNIT_NAME.MG: {
      return value / 1_000;
    }
    case FDC_UNIT_NAME.UG: {
      return value / 1_000_000;
    }
    default: {
      return value;
    }
  }
};
