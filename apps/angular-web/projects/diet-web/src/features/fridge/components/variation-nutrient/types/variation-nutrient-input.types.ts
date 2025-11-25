import * as z from 'zod/v4-mini';

import {
  unit,
  variationNutrientName,
  variationNutrientValue,
} from '@/features/fridge/types/internal/variation.types';

export const amount = z.tuple([variationNutrientValue, unit]);

export const variationNutrientInput = z.object({
  name: variationNutrientName,
  amount,
  nutrientId: z.nullable(z.string()),
});
export type VariationNutrientInput = z.infer<typeof variationNutrientInput>;

export const variationNutrientInputUpdate = z.extend(variationNutrientInput, {
  nutrientId: z.string(),
});
export type VariationNutrientInputUpdate = z.infer<typeof variationNutrientInputUpdate>;
