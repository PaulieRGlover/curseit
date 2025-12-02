import type { Prisma } from '@curseit/diet-orm';

import { FoodWithPortionsDto } from '../dto/fridge.dto';

import { portionToPortionDto } from './portion-to-portion-dto.transformer';

export const foodToFoodWithPortions = (
  food: Prisma.FoodGetPayload<{ include: { variations: { include: { portions: true } } } }>,
): FoodWithPortionsDto => {
  return {
    ...food,
    portions: food.variations.flatMap(variation => {
      return variation.portions.map(portion => {
        return portionToPortionDto({ ...portion, foodVariation: variation });
      });
    }),
  };
};
