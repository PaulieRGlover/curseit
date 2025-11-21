import { createZodDto } from '@anatine/zod-nestjs';

import z from 'zod';

import { ENERGY, UNITS } from '@curseit/units';

export const FoodUnitSchema = z.enum([
  UNITS.MILLIGRAM,
  UNITS.GRAM,
  UNITS.KILOGRAM,
  UNITS.OUNCE,
  UNITS.POUND,
]);

export const NutrientUnitSchema = z.enum([
  UNITS.MICROGRAM,
  UNITS.MILLIGRAM,
  UNITS.GRAM,
]);

export const NutrientSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string().nullable(),
  description: z.string().nullable(),
});
export class NutrientDto extends createZodDto(NutrientSchema) {}

export const NutrientAbridgedSchema = NutrientSchema.omit({ shortName: true, description: true });
export class NutrientAbridgedDto extends createZodDto(NutrientAbridgedSchema) {}

export const NutrientsSchema = z.array(NutrientSchema);
export class NutrientsDto extends createZodDto(NutrientsSchema) {}

export const NutrientsAbridgedSchema = z.array(NutrientAbridgedSchema);
export class NutrientsAbridgedDto extends createZodDto(NutrientsAbridgedSchema) {}

export const VariationSchema = z.object({
  id: z.string(),
  name: z.string(),
  counter: z.string(),
  referenceSizeInGrams: z.number(),
  referenceSizeDisplayUnit: FoodUnitSchema,
  portionSizeInGrams: z.number(),
  portionSizeDisplayUnit: FoodUnitSchema,
  energyAuto: z.boolean(),
  energyAmountInKcal: z.number().nullable(),
  energyDisplayUnit: z.nativeEnum(ENERGY),
});
export class VariationDto extends createZodDto(VariationSchema) {}

export const VariationsSchema = z.array(VariationSchema);
export class VariationsDto extends createZodDto(VariationsSchema) {}

export const VariationCreateSchema = VariationSchema.pick({ name: true });
export class VariationCreateDto extends createZodDto(VariationCreateSchema) {}

export const VariationUpdateSchema = VariationSchema.omit({ id: true }).partial();
export class VariationUpdateDto extends createZodDto(VariationUpdateSchema) {}

export const PortionSchema = z.object({
  id: z.string(),
  variationId: z.string(),
  counter: z.string(),
  timeAdded: z.date(),
  timeExpiring: z.date(),
  sizeInGrams: z.number(),
  sizeDisplayUnit: z.string(),
});
export class PortionDto extends createZodDto(PortionSchema) {}

export const PortionsSchema = z.array(PortionSchema);
export class PortionsDto extends createZodDto(PortionsSchema) {}

export const VariationNutrientSchema = z.object({
  id: z.string(),
  name: z.string(),
  valueInGrams: z.number(),
  valueDisplayUnit: NutrientUnitSchema,
  nutrientId: z.string(),
});
export class VariationNutrientDto extends createZodDto(VariationNutrientSchema) {}

export const VariationNutrientCreate = VariationNutrientSchema.omit({ id: true });
export class VariationNutrientCreateDto extends createZodDto(VariationNutrientCreate) {}

export const VariationNutrientUpdate = VariationNutrientSchema;
export class VariationNutrientUpdateDto extends createZodDto(VariationNutrientUpdate) {}

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
