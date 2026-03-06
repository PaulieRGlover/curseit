import * as z from 'zod/v4-mini';

import { foodUnit } from '../../../../shared/types/unit.types';

export const portion = z.object({
  id: z.string(),
  variationId: z.string(),
  foodId: z.string(),
  counter: z.emoji(),
  dateAdded: z.iso.datetime(),
  dateExpiring: z.nullable(z.iso.datetime()),
  sizeInGrams: z.number(),
  sizeDisplayUnit: foodUnit,
  remainingInGrams: z.number(),
  remainingDisplayUnit: foodUnit,
  freshness: z.nullable(z.number().check(z.minimum(0), z.maximum(1))),
});
export type Portion = z.infer<typeof portion>;

export const portionAbridged = z.pick(portion, {
  id: true,
  variationId: true,
  foodId: true,
  counter: true,
  freshness: true,
  sizeInGrams: true,
  remainingInGrams: true,
});
export type PortionAbridged = z.infer<typeof portionAbridged>;

export const portionsAbridged = z.array(portionAbridged);
export type PortionsAbridged = z.infer<typeof portionsAbridged>;

export const portionErrors = z.object({
  id: z.string(),
  dateExpiring: z.array(z.string()),
});
export type PortionErrors = z.infer<typeof portionErrors>;

export const portions = z.array(portion);
export type Portions = z.infer<typeof portions>;
