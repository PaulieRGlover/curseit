import { Prisma } from '@curseit/diet-orm';
import { PortionDto } from '../dto/fridge.dto';

export const portionToPortionDto = (
  portion: Prisma.FoodPortionGetPayload<{
    include: { foodVariation: { select: { id: true, counter: true } } };
  }>,
): PortionDto => {
  const { foodVariation, ...portionWithoutVariation } = portion;

  return {
    ...portionWithoutVariation,
    variationId: foodVariation.id,
    counter: foodVariation.counter,
    dateAdded: portion.dateAdded.toISOString(),
    dateExpiring: portion.dateExpiring?.toISOString() ?? null,
  };
};
