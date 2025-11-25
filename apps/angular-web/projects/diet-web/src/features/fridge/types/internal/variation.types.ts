import * as z from 'zod/v4-mini';

import { UNITS } from '@curseit/units';

import { variation } from '../external/variation.types';

export const variationNutrientName = z
  .string()
  .check(
    z.maxLength(255, { message: "Name shouldn't be longer than 255 symbols" }),
    z.minLength(1, { message: 'Name is required' }),
  );

export const variationNutrientValue = z
  .number()
  .check(
    z.minimum(0, { message: 'Value should be a positive number' }),
    z.maximum(1000000, { message: "Maybe it's worth considering to upscale the unit?" }),
  );

export const unit = z.enum([UNITS.GRAM, UNITS.MILLIGRAM, UNITS.MICROGRAM]);

export const variationNutrientCreate = z.object({
  name: variationNutrientName,
  valueInGrams: variationNutrientValue,
  valueDisplayUnit: unit,
  nutrientId: z.string(),
});
export type VariationNutrientCreate = z.infer<typeof variationNutrientCreate>;

export const variationNutrientUpdate = z.extend(variationNutrientCreate, { id: z.string() });
export type VariationNutrientUpdate = z.infer<typeof variationNutrientUpdate>;

export const variationCreate = z.pick(variation, { name: true });
export type VariationCreate = z.infer<typeof variationCreate>;

export const variationUpdate = z.partial(z.omit(variation, { id: true }));
export type VariationUpdate = z.infer<typeof variationUpdate>;
