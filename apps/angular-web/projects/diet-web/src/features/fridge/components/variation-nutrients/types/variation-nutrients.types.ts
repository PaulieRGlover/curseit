import * as z from 'zod/v4-mini';

import {
  variationNutrient,
  variationNutrientNutrientId,
} from '@/features/fridge/types/external/variation.types';

export const Nutrient = z.extend(variationNutrient, {
  nutrientId: z.nullable(variationNutrientNutrientId),
});
export type Nutrient = z.infer<typeof Nutrient>;

export const variationNutrientsNutrients = z.array(Nutrient);
export type Nutrients = z.infer<typeof variationNutrientsNutrients>;
