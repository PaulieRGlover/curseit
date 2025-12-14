import * as z from 'zod/v4-mini';

import { foodUnit } from '@/features/fridge/types/external/unit.types';
import { variationAbridged } from '@/features/fridge/types/external/variation.types';
import {
  portionSizeUnit,
  portionSizeValue,
} from '@/features/fridge/types/internal/variation.types';

export const remainingValue = z.number().check(z.minimum(0), z.maximum(1000));
export type RemainingValue = z.infer<typeof remainingValue>;

export const remainingUnit = foodUnit;
export type RemainingUnit = z.infer<typeof remainingUnit>;

export const portionModel = z.object({
  variation: variationAbridged,
  dateAdded: z.date(),
  dateExpiring: z.nullable(z.date()),
  portionSizeValue,
  portionSizeUnit,
  remainingValue,
  remainingUnit,
});

export type PortionModel = z.infer<typeof portionModel>;
