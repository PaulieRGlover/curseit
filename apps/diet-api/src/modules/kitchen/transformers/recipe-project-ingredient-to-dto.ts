import { Prisma } from '@curseit/diet-orm';

import { portionCalculateFreshness } from '@/utils/portion-calculate-freshness';
import { RecipeProjectIngredientDto } from '../dto/kitchen.dto';

export const recipeProjectIngredientToDto = (
  ingredient: Prisma.RecipeProjectIngredientGetPayload<{
    include: { foodPortion: { include: { foodVariation: true } } };
  }>,
): RecipeProjectIngredientDto => {
  const dto: RecipeProjectIngredientDto = {
    id: ingredient.id,
    foodId: ingredient.foodId,
    foodPortionId: ingredient.foodPortionId,
    foodVariationId: ingredient.foodVariationId,
    sizeInGrams: ingredient.sizeInGrams,
    sizeDisplayUnit: ingredient.sizeDisplayUnit,
  };

  const { foodPortion } = ingredient;
  if (foodPortion) {
    const {
      foodVariation,
      dateAdded,
      dateExpiring,
      remainingInGrams,
    } = foodPortion;

    dto.counter = foodVariation.counter;
    dto.freshness = portionCalculateFreshness(dateAdded, dateExpiring);
    dto.maximumSizeInGrams = remainingInGrams;
  }

  return dto;
};
