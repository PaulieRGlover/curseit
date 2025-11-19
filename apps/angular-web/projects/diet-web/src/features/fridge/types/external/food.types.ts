import * as z from 'zod/v4-mini';

import { ENERGY, UNITS } from '@curseit/units';

export const foodUnit = z.enum([
  UNITS.MILLIGRAM,
  UNITS.GRAM,
  UNITS.KILOGRAM,
  UNITS.OUNCE,
  UNITS.POUND,
]);

export const nutrientUnit = z.enum([
  UNITS.MICROGRAM,
  UNITS.MILLIGRAM,
  UNITS.GRAM,
]);

export const nutrient = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.nullable(z.string()),
  description: z.nullable(z.string()),
});
export type Nutrient = z.infer<typeof nutrient>;

export const nutrientAbridged = z.omit(nutrient, {
  shortName: true,
  description: true,
});
export type NutrientAbridged = z.infer<typeof nutrientAbridged>;

export const nutrients = z.array(nutrient);
export type Nutrients = z.infer<typeof nutrients>;

export const nutrientsAbridged = z.array(nutrientAbridged);
export type NutrientsAbridged = z.infer<typeof nutrientsAbridged>;

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

export const variationCreate = z.pick(variation, { name: true });
export type VariationCreate = z.infer<typeof variationCreate>;

export const variationUpdate = z.partial(z.omit(variation, { id: true }));
export type VariationUpdate = z.infer<typeof variationUpdate>;

export const variationAbridged = z.pick(variation, { id: true, name: true });
export type VariationAbridged = z.infer<typeof variationAbridged>;

export const variationsAbridged = z.array(variationAbridged);
export type VariationsAbridged = z.infer<typeof variationsAbridged>;

export const variationWithNutrients = z.extend(variation, {
  nutrients: variationNutrients,
});
export type VariationWithNutrients = z.infer<typeof variationWithNutrients>;

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
