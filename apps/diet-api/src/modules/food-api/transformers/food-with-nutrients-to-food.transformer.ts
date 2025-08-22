import { FoodDto, FoodWithNutrients } from '../dto/foods.dto';

export const foodWithNutrientsToFood = (
  foodWithNutrients: FoodWithNutrients,
): FoodDto => {
  const { nutrients: _nutrients, ...food } = foodWithNutrients;
  return food;
};
