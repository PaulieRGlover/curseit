import { type Food as FoodsPrismaFood } from '@curseit/foods-prisma';
import { Food } from '../dto/foods.dto';

export const foodsPrismaFoodToFood = (food: FoodsPrismaFood): Food => {
  return {
    id: food.id,
    name: food.name,
  };
};
