import { NutrientAbridgedDto, NutrientDto } from '../dto/fridge.dto';

export const nutrientToNutrientAbridged = (nutrient: NutrientDto): NutrientAbridgedDto => {
  return {
    id: nutrient.id,
    name: nutrient.shortName ?? nutrient.name,
  };
};
