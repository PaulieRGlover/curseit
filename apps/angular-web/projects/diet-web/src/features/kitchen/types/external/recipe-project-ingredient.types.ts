import * as z from 'zod/v4-mini';

import { foodUnit } from '@/shared/types/unit.types';

export const ingredient = z.object({
  id: z.string(),
  foodPortionId: z.string(),
  variationId: z.string(),
  foodId: z.string(),
  counter: z.emoji(),
  freshness: z.nullable(z.number().check(z.minimum(0), z.maximum(1))),
  sizeInGrams: z.number(),
  sizeDisplayUnit: foodUnit,
  maximumSizeInGrams: z.number(),
});
export type Ingredient = z.infer<typeof ingredient>;

export const ingredients = z.array(ingredient);
export type Ingredients = z.infer<typeof ingredients>;
