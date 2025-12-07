import * as z from 'zod/v4-mini';

import { portionAbridged } from './portion.types';
import { variationsAbridged } from './variation.types';

export const food = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  perishable: z.boolean(),
  favorite: z.boolean(),
  picture: z.nullable(z.string()),
});
export type Food = z.infer<typeof food>;

export const foods = z.array(food);
export type Foods = z.infer<typeof foods>;

export const foodWithVariations = z.extend(food, {
  variations: variationsAbridged,
});
export type FoodWithVariations = z.infer<typeof foodWithVariations>;

export const foodWithPortions = z.extend(food, {
  portions: z.array(portionAbridged),
});
export type FoodWithPortions = z.infer<typeof foodWithPortions>;

export const foodsWithPortions = z.array(foodWithPortions);
export type FoodsWithPortions = z.infer<typeof foodsWithPortions>;
