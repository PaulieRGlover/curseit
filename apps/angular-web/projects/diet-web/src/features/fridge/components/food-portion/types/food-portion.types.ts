import * as z from 'zod/v4-mini';

import { variationAbridged } from '@/features/fridge/types/external/variation.types';
import { counter, portionSize } from '@/features/fridge/types/internal/variation.types';

export const portionInput = z.object({
  variation: variationAbridged,
  counter,
  dateAdded: z.date(),
  dateExpiring: z.nullable(z.date()),
  portionSize,
});

export type PortionInput = z.infer<typeof portionInput>;
