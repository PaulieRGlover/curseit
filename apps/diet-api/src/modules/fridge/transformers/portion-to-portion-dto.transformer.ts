import { Prisma } from '@curseit/diet-orm';
import { PortionDto } from '../dto/fridge.dto';
import { portionCalculateFreshness } from '../../../utils/portion-calculate-freshness';

export const portionToPortionDto = (
  portion: Prisma.FoodPortionGetPayload<{
    include: { foodVariation: { select: { id: true, foodId: true, counter: true } } };
  }>,
): PortionDto => {
  const { foodVariation, ...portionWithoutVariation } = portion;

  return {
    ...portionWithoutVariation,
    variationId: foodVariation.id,
    foodId: foodVariation.foodId,
    counter: foodVariation.counter,
    dateAdded: portion.dateAdded.toISOString(),
    dateExpiring: portion.dateExpiring?.toISOString() ?? null,
    freshness: portionCalculateFreshness(portion.dateAdded, portion.dateExpiring),
  };
};
