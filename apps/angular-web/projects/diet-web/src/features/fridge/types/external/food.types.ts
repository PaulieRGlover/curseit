import * as z from 'zod/v4-mini';

import { UNITS } from '@curseit/units';

import { variationsAbridged } from './variation.types';

export const foodUnit = z.enum([
  UNITS.MILLIGRAM,
  UNITS.GRAM,
  UNITS.KILOGRAM,
  UNITS.OUNCE,
  UNITS.POUND,
]);

export const food = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  perishable: z.boolean(),
  favorite: z.boolean(),
  picture: z.nullable(z.string()),
});
export type Food = z.infer<typeof food>;

export const foodWithVariations = z.extend(food, {
  variations: variationsAbridged,
});
export type FoodWithVariations = z.infer<typeof foodWithVariations>;

export const foodWithPortions = z.extend(food, {
  portions: z.array(z.object()),
});
export type FoodWithPortions = z.infer<typeof foodWithPortions>;

export const foodsWithPortions = z.array(foodWithPortions);
export type FoodsWithPortions = z.infer<typeof foodsWithPortions>;
