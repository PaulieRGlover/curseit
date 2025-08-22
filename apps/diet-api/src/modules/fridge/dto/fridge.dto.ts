import { createZodDto } from '@anatine/zod-nestjs';

import z from 'zod';

import { ENERGY, UNITS } from '@curseit/units';

export const NutrientSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string().nullable(),
  description: z.string().nullable(),
});
export class NutrientDto extends createZodDto(NutrientSchema) {}

export const NutrientsSchema = z.array(NutrientSchema);
export class NutrientsDto extends createZodDto(NutrientsSchema) {}

export const PortionSchema = z.object({
  id: z.string(),
  variationId: z.string(),
  counter: z.string(),
  timeAdded: z.date(),
  timeExpiring: z.date(),
  sizeInGrams: z.number(),
  sizeDisplayUnit: z.string(),
});

export const VariationSchema = z.object({
  id: z.string(),
  name: z.string(),
  counter: z.string(),
  referenceSizeInGrams: z.number(),
  referenceSizeDisplayUnit: z.nativeEnum(UNITS),
  portionSizeInGrams: z.number(),
  portionSizeDisplayUnit: z.nativeEnum(UNITS),
  energyAuto: z.boolean(),
  energyAmount: z.number().nullable(),
  energyDisplayUnit: z.nativeEnum(ENERGY),
});
export class VariationDto extends createZodDto(VariationSchema) {}

export const VariationNutrientSchema = z.object({
  id: z.string(),
  name: z.string(),
  valueInGrams: z.number(),
  valueDisplayUnit: z.nativeEnum(UNITS),
});
export class VariationNutrientDto extends createZodDto(VariationNutrientSchema) {}

export const VariationNutrientInput = VariationNutrientSchema.omit({ id: true }).extend({
  nutrientId: z.string(),
});
export class VariationNutrientInputDto extends createZodDto(VariationNutrientInput) {}

export const VariationWithNutrientsSchema = VariationSchema.extend({
  nutrients: z.array(VariationNutrientSchema),
});
export class VariationWithNutrientsDto extends createZodDto(VariationWithNutrientsSchema) {}

export const VariationAbridgedSchema = VariationSchema.pick({ id: true, name: true });

export const FoodSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  perishable: z.boolean(),
  favorite: z.boolean(),
  picture: z.string().nullable(),
});
export class FoodDto extends createZodDto(FoodSchema) {}

export const FoodInputSchema = FoodSchema.omit({ id: true }).partial();
export class FoodInputDto extends createZodDto(FoodInputSchema) {}

export const FoodWithPortionsSchema = FoodSchema.extend({
  portions: z.array(PortionSchema),
});
export class FoodWithPortionsDto extends createZodDto(FoodWithPortionsSchema) {}

export const FoodWithVariationsSchema = FoodSchema.extend({
  variations: z.array(VariationAbridgedSchema),
});
export class FoodWithVariationsDto extends createZodDto(FoodWithVariationsSchema) {}

export const FoodsSchema = z.array(FoodSchema);
export class FoodsDto extends createZodDto(FoodsSchema) {}

export const FoodsWithPortionsSchema = z.array(FoodWithPortionsSchema);
export class FoodsWithPortionsDto extends createZodDto(FoodsWithPortionsSchema) {}
