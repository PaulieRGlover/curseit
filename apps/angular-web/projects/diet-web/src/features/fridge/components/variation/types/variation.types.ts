import * as z from 'zod/v4-mini';

import {
  counter,
  energyAmount,
  energyAuto,
  energyUnit,
  portionSizeUnit,
  portionSizeValue,
  referenceSizeUnit,
  referenceSizeValue,
} from '@/features/fridge/types/internal/variation.types';

export const variationModel = z.object({
  referenceSizeValue,
  referenceSizeUnit,
  energyAmount,
  energyUnit,
  energyAuto,
  portionSizeValue,
  portionSizeUnit,
  counter,
});
export type VariationModel = z.infer<typeof variationModel>;

export const variationModelUpdate = z.partial(variationModel);
export type VariationModelUpdate = z.infer<typeof variationModelUpdate>;
