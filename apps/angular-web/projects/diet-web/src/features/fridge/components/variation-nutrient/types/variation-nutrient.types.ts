import * as z from 'zod/v4-mini';

import { nutrientAbridged } from '@/features/fridge/types/external/nutrient.types';
import {
  variationNutrient,
  variationNutrientNutrientId,
} from '@/features/fridge/types/external/variation.types';
import {
  nutrientUnit,
  variationNutrientValue,
} from '@/features/fridge/types/internal/variation.types';

export const nutrientInput = z.extend(variationNutrient, {
  nutrientId: z.nullable(variationNutrientNutrientId),
});
export type NutrientInput = z.infer<typeof nutrientInput>;

export const nutrientModel = z.object({
  core: z.nullable(nutrientAbridged),
  amountValue: variationNutrientValue,
  amountUnit: nutrientUnit,
});
export type NutrientModel = z.infer<typeof nutrientModel>;
