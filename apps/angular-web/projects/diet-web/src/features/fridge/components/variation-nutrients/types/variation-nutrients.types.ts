import * as z from 'zod/v4-mini';

import {
  variationNutrient,
  variationNutrientNutrientId,
} from '@/features/fridge/types/external/variation.types';

export const newNutrientModel = z.extend(variationNutrient, {
  nutrientId: z.nullable(variationNutrientNutrientId),
});
export type NewNutrientModel = z.infer<typeof newNutrientModel>;
