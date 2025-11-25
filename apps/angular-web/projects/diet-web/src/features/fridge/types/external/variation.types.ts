import * as z from 'zod/v4-mini';

import { ENERGY } from '@curseit/units';

import { foodUnit, nutrientUnit } from './unit.types';

export const variation = z.object({
  id: z.string(),
  name: z.string(),
  counter: z.emoji(),
  referenceSizeInGrams: z.number(),
  referenceSizeDisplayUnit: foodUnit,
  portionSizeInGrams: z.number(),
  portionSizeDisplayUnit: foodUnit,
  energyAuto: z.boolean(),
  energyAmountInKcal: z.nullable(z.number()),
  energyDisplayUnit: z.enum(ENERGY),
});
export type Variation = z.infer<typeof variation>;

export const variations = z.array(variation);
export type Variations = z.infer<typeof variations>;

export const variationAbridged = z.pick(variation, { id: true, name: true });
export type VariationAbridged = z.infer<typeof variationAbridged>;

export const variationsAbridged = z.array(variationAbridged);
export type VariationsAbridged = z.infer<typeof variationsAbridged>;

export const variationNutrient = z.object({
  id: z.string(),
  name: z.string(),
  valueInGrams: z.number(),
  valueDisplayUnit: nutrientUnit,
  nutrientId: z.nullable(z.string()),
});
export type VariationNutrient = z.infer<typeof variationNutrient>;

export const variationNutrients = z.array(variationNutrient);
export type VariationNutrients = z.infer<typeof variationNutrients>;

export const variationWithNutrients = z.extend(variation, {
  nutrients: variationNutrients,
});
export type VariationWithNutrients = z.infer<typeof variationWithNutrients>;
