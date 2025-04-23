import { type Food as DietPrismaFood } from '@curseit/diet-prisma';
import { Food } from '../dto/foods.dto';

export const dietPrismaFoodToFood = (food: DietPrismaFood): Food => {
  return {
    id: food.id,
    name: food.name,
  };
};
