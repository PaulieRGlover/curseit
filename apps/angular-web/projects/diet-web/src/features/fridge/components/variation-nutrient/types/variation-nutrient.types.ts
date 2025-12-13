import * as z from 'zod/v4-mini';

import { nutrientAbridged } from '@/features/fridge/types/external/nutrient.types';
import {
  variationNutrient,
  variationNutrientNutrientId,
} from '@/features/fridge/types/external/variation.types';
import { unit, variationNutrientValue } from '@/features/fridge/types/internal/variation.types';

export const amount = z.tuple([variationNutrientValue, unit]);

export const nutrientInput = z.extend(variationNutrient, {
  nutrientId: z.nullable(variationNutrientNutrientId),
});
export type NutrientInput = z.infer<typeof nutrientInput>;

export const nutrientModel = z.object({
  core: z.nullable(nutrientAbridged),
  amount,
});
export type NutrientModel = z.infer<typeof nutrientModel>;
