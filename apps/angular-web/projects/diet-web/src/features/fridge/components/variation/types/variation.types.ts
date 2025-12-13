import * as z from 'zod/v4-mini';

import {
  counter,
  energy,
  energyAuto,
  portionSize,
  referenceSize,
} from '@/features/fridge/types/internal/variation.types';

export const variationModel = z.object({
  referenceSize,
  energy,
  energyAuto,
  portionSize,
  counter,
});
export type VariationModel = z.infer<typeof variationModel>;

export const variationModelUpdate = z.partial(variationModel);
export type VariationModelUpdate = z.infer<typeof variationModelUpdate>;
