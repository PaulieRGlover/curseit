import { Prisma } from '@curseit/diet-orm';
import { VariationNutrientDto } from '../dto/fridge.dto';

export const variationNutrientToDto = (
  variationNutrient: Prisma.NutrientInFoodVariationGetPayload<{
    include: { foodVariation: true; nutrient: true };
  }>,
): VariationNutrientDto => {
  return {
    id: variationNutrient.id,
    name: variationNutrient.nutrient.name,
    valueInGrams: variationNutrient.valueInGrams,
    valueDisplayUnit: variationNutrient.valueDisplayUnit,
  };
};
