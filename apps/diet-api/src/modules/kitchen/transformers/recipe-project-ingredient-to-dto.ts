import { Prisma } from '@curseit/diet-orm';

import { portionCalculateFreshness } from '@/utils/portion-calculate-freshness';

export const recipeProjectIngredientToDto = (
  ingredient: Prisma.RecipeProjectIngredientGetPayload<{
    include: { foodPortion: { include: { foodVariation: true } } };
  }>,
) => {
  const {
    foodVariationId,
    foodVariation: { foodId, counter },
    dateAdded,
    dateExpiring,
  } = ingredient.foodPortion;

  return {
    id: ingredient.id,
    foodPortionId: ingredient.foodPortionId,
    variationId: foodVariationId,
    foodId,
    counter,
    freshness: portionCalculateFreshness(dateAdded, dateExpiring),
    sizeInGrams: ingredient.sizeInGrams,
    sizeDisplayUnit: ingredient.sizeDisplayUnit,
    maximumSizeInGrams: ingredient.foodPortion.remainingInGrams,
  };
};
