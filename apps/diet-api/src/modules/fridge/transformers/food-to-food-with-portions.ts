import type { Prisma } from '@curseit/diet-orm';

import { FoodWithPortionsDto } from '../dto/fridge.dto';

export const foodToFoodWithPortions = (
  food: Prisma.FoodGetPayload<{ include: { variations: { include: { portions: true } } } }>,
): FoodWithPortionsDto => {
  return {
    ...food,
    portions: food.variations.flatMap(variation => {
      return variation.portions.map(portion => {
        return {
          ...portion,
          variationId: variation.id,
          counter: variation.counter,
        };
      });
    }),
  };
};
