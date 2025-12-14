import { Food } from '@/features/fridge/types/external/food.types';
import { FoodBasicInfoModel } from '../types/food-basic-info.types';

export const foodToFoodBasicInfoModel = (food: Food): FoodBasicInfoModel => {
  const { name, description, perishable } = food;
  return { name, description, perishable };
};
