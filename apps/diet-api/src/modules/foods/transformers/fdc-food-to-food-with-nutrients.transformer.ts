import { FoodWithNutrients } from '../dto/foods.dto';
import { FdcSearchResultFood } from '../modules/fdc/external/fdc.types';
import { v4 as uuidv4 } from 'uuid';

const ENERGY_NUTRIENT_NAME = 'Energy';

export const fdcFoodToFoodWithNutrients = (fdcFood: FdcSearchResultFood): FoodWithNutrients => {
  return {
    id: uuidv4(),
    name: fdcFood.description,
    nutrients: fdcFood.foodNutrients ? fdcFood.foodNutrients.map(fdcNutrient => {
      let name = fdcNutrient.nutrientName;
      if (name === ENERGY_NUTRIENT_NAME) {
        name += `, in ${fdcNutrient.unitName}`;
      }

      return {
        name,
        value: fdcNutrient.value,
      };
    }) : [],
  };
};
