import { type Food as FoodsOrmFood } from '@curseit/foods-orm';

import { Food } from '../dto/foods.dto';

export const dietPrismaFoodToFood = (food: FoodsOrmFood): Food => {
  return {
    id: food.id,
    name: food.name,
    provider: food.provider,
  };
};
