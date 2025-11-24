import * as z from 'zod/v4-mini';

import { variationNutrient } from '../../../types/external/variation.types';

export const variationNutrientListItem = z.extend(variationNutrient, {
  id: z.optional(z.string()),
  internalId: z.string(),
  isEmpty: z.boolean(),
});
export type VariationNutrientListItem = z.infer<typeof variationNutrientListItem>;

export const variationNutrientListItemUpdate = z.extend(z.omit(variationNutrient, { id: true }), {
  nutrientId: z.string(),
});

export type VariationNutrientListItemUpdate = z.infer<typeof variationNutrientListItemUpdate>;
