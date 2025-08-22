import { type Food as FoodsOrmFood } from '@curseit/foods-orm';

import { FoodDto } from '../dto/foods.dto';

export const dietPrismaFoodToFood = (food: FoodsOrmFood): FoodDto => {
  return {
    id: food.id,
    name: food.name,
    provider: food.provider,
  };
};
