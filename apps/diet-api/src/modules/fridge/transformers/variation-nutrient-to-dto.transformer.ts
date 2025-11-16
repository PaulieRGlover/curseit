import { Prisma } from '@curseit/diet-orm';
import { VariationNutrientDto } from '../dto/fridge.dto';

export const variationNutrientToDto = (
  variationNutrient: Prisma.NutrientInFoodVariationGetPayload<{
    include: { nutrient: true };
  }>,
): VariationNutrientDto => {
  return {
    id: variationNutrient.id,
    name: variationNutrient.nutrient.shortName ?? variationNutrient.nutrient.name,
    valueInGrams: variationNutrient.valueInGrams,
    valueDisplayUnit: variationNutrient.valueDisplayUnit,
    nutrientId: variationNutrient.nutrientId,
  };
};
