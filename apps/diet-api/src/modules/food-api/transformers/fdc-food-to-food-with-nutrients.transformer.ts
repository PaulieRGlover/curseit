import { v4 as uuidv4 } from 'uuid';

import { mapAndFilter } from '@curseit/utils';

import { FoodWithNutrients } from '../dto/foods.dto';
import { NutrientInFood } from '../dto/nutrients.dto';
import { FdcFoodNutrientAbridged, FdcSearchResultFood } from '../modules/fdc/external/fdc.types';

import { fdcNutrientToNutrient } from './fdc-nutrient-to-nutrient.transformer';

export const fdcFoodToFoodWithNutrients = (fdcFood: FdcSearchResultFood): FoodWithNutrients => {
  return {
    id: uuidv4(),
    name: fdcFood.description,
    provider: 'FDC',
    providerId: fdcFood.fdcId.toString(),
    providerCategory: fdcFood.dataType,
    providerSubcategory: fdcFood.foodCategory,
    nutrients: mapAndFilter<FdcFoodNutrientAbridged, NutrientInFood>(
      fdcFood.foodNutrients ?? [],
      fdcNutrientToNutrient,
    ),
  };
};
