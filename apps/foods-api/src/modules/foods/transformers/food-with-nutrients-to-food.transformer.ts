import { Food, FoodWithNutrients } from '../dto/foods.dto';

export const foodWithNutrientsToFood = (
  foodWithNutrients: FoodWithNutrients,
): Food => {
  const { nutrients, ...food } = foodWithNutrients;
  return food;
};
