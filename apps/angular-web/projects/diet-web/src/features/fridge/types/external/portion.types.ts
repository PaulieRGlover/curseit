import * as z from 'zod/v4-mini';

import { foodUnit } from './unit.types';

export const portion = z.object({
  id: z.string(),
  counter: z.emoji(),
  dateAdded: z.iso.datetime(),
  dateExpiring: z.nullable(z.iso.datetime()),
  sizeInGrams: z.number(),
  sizeDisplayUnit: foodUnit,
  variationId: z.string(),
});
export type Portion = z.infer<typeof portion>;

export const portions = z.array(portion);
export type Portions = z.infer<typeof portions>;
