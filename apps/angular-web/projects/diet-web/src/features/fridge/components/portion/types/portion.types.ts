import * as z from 'zod/v4-mini';

import { foodUnit } from '@/features/fridge/types/external/unit.types';
import { variationAbridged } from '@/features/fridge/types/external/variation.types';
import { portionSize } from '@/features/fridge/types/internal/variation.types';

export const remainingValue = z.number().check(z.minimum(0), z.maximum(1000));
export type RemainingValue = z.infer<typeof remainingValue>;

export const remainingUnit = foodUnit;
export type RemainingUnit = z.infer<typeof remainingUnit>;

export const remaining = z.tuple([remainingValue, remainingUnit]);
export type Remaining = z.infer<typeof remaining>;

export const portionInput = z.object({
  variation: variationAbridged,
  dateAdded: z.date(),
  dateExpiring: z.nullable(z.date()),
  portionSize,
  remaining,
});

export type PortionInput = z.infer<typeof portionInput>;
