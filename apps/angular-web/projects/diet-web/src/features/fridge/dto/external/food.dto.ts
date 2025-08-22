import * as z from 'zod/v4-mini';

import { ENERGY, UNITS } from '@curseit/units';

export const nutrientSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.nullable(z.string()),
  description: z.nullable(z.string()),
});
export type Nutrient = z.infer<typeof nutrientSchema>;

export const nutrientsSchema = z.array(nutrientSchema);
export type Nutrients = z.infer<typeof nutrientsSchema>;

export const variationNutrientSchema = z.object({
  id: z.string(),
  name: z.string(),
  valueInGrams: z.number(),
  valueDisplayUnit: z.enum(UNITS),
});
export type VariationNutrient = z.infer<typeof variationNutrientSchema>;

export const variationNutrientsSchema = z.array(variationNutrientSchema);
export type VariationNutrients = z.infer<typeof variationNutrientsSchema>;

export const variationSchema = z.object({
  id: z.string(),
  name: z.string(),
  counter: z.emoji(),
  referenceSizeInGrams: z.number(),
  referenceSizeDisplayUnit: z.enum(UNITS),
  portionSizeInGrams: z.number(),
  portionSizeDisplayUnit: z.enum(UNITS),
  energyAuto: z.boolean(),
  energyAmount: z.nullable(z.number()),
  energyDisplayUnit: z.enum(ENERGY),
});
export type Variation = z.infer<typeof variationSchema>;

export const variationAbridgedSchema = z.pick(variationSchema, { id: true, name: true });
export type VariationAbridged = z.infer<typeof variationAbridgedSchema>;

export const variationsAbridgedSchema = z.array(variationAbridgedSchema);
export type VariationsAbridged = z.infer<typeof variationsAbridgedSchema>;

export const variationWithNutrientsSchema = z.extend(variationSchema, {
  nutrients: variationNutrientsSchema,
});
export type VariationWithNutrients = z.infer<typeof variationWithNutrientsSchema>;

export const foodSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  perishable: z.boolean(),
  favorite: z.boolean(),
  picture: z.nullable(z.string()),
});
export type Food = z.infer<typeof foodSchema>;

export const foodWithVariationsSchema = z.extend(foodSchema, {
  variations: variationsAbridgedSchema,
});
export type FoodWithVariations = z.infer<typeof foodWithVariationsSchema>;

export const foodWithPortions = z.extend(foodSchema, {
  portions: z.array(z.object()),
});
export type FoodWithPortions = z.infer<typeof foodWithPortions>;

export const foodsWithPortionsSchema = z.array(foodWithPortions);
export type FoodsWithPortions = z.infer<typeof foodsWithPortionsSchema>;
