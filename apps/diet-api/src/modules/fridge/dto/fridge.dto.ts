import { createZodDto } from '@anatine/zod-nestjs';

import z, { ZodIssueCode } from 'zod';

import { Nullable } from '@curseit/types';
import { ENERGY, UNITS } from '@curseit/units';

export const FoodUnitSchema = z.enum([
  UNITS.MILLIGRAM,
  UNITS.GRAM,
  UNITS.KILOGRAM,
  UNITS.OUNCE,
  UNITS.POUND,
]);

export const NutrientUnitSchema = z.enum([UNITS.MICROGRAM, UNITS.MILLIGRAM, UNITS.GRAM]);

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

const name = z.string();
export const VariationSchema = z.object({
  id: z.string(),
  name,
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

export const VariationCreateSchema = VariationSchema.omit({ id: true }).partial().extend({ name });
export class VariationCreateDto extends createZodDto(VariationCreateSchema) {}

export const VariationUpdateSchema = VariationSchema.omit({ id: true }).partial();
export class VariationUpdateDto extends createZodDto(VariationUpdateSchema) {}

const portionId = z.string();
const portionDatesRefinement = (
  data: {
    dateAdded?: Nullable<string>;
    dateExpiring?: Nullable<string>;
  },
  context: z.RefinementCtx,
  index?: number,
) => {
  if (
    data.dateExpiring &&
    data.dateAdded &&
    new Date(data.dateExpiring) < new Date(data.dateAdded)
  ) {
    context.addIssue({
      path: typeof index === 'number' ? [index, 'dateExpiring'] : ['dateExpiring'],
      code: ZodIssueCode.custom,
      message: 'Expiration date should be after addition date',
    });
  }
};
export const PortionSchemaBase = z.object({
  id: portionId,
  variationId: z.string(),
  foodId: z.string(),
  counter: z.string(),
  dateAdded: z.string().datetime(),
  dateExpiring: z.string().datetime().nullable(),
  sizeInGrams: z.number(),
  sizeDisplayUnit: FoodUnitSchema,
  freshness: z.number().min(0).max(1).nullable(),
});
export const PortionSchema = PortionSchemaBase.superRefine(portionDatesRefinement);
export class PortionDto extends createZodDto(PortionSchema) {}

export const PortionsSchema = z.array(PortionSchemaBase).superRefine((data, context) => {
  data.forEach((portion, index) => {
    portionDatesRefinement(portion, context, index);
  });
});
export class PortionsDto extends createZodDto(PortionsSchema) {}

export const PortionCreateSchema = PortionSchemaBase.omit({
  id: true,
  foodId: true,
  counter: true,
  freshness: true,
})
  .partial()
  .required({ variationId: true })
  .superRefine(portionDatesRefinement);
export class PortionCreateDto extends createZodDto(PortionCreateSchema) {}

export const PortionUpdateSchema = PortionSchemaBase.omit({
  id: true,
  foodId: true,
  counter: true,
  freshness: true,
})
  .partial()
  .superRefine(portionDatesRefinement);
export class PortionUpdateDto extends createZodDto(PortionUpdateSchema) {}

export const PortionBulkCreateSchema = z.array(PortionCreateSchema).superRefine((data, context) => {
  data.forEach((portion, index) => {
    portionDatesRefinement(portion, context, index);
  });
});
export class PortionBulkCreateDto extends createZodDto(PortionBulkCreateSchema) {}

export const PortionBulkDeleteSchema = z.object({
  ids: z.array(portionId),
});
export class PortionBulkDeleteDto extends createZodDto(PortionBulkDeleteSchema) {}

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

export const PortionSchemaAbridged = PortionSchemaBase.pick({
  id: true,
  variationId: true,
  foodId: true,
  counter: true,
  freshness: true,
});

export const FoodWithPortionsSchema = FoodSchema.extend({
  portions: z.array(PortionSchemaAbridged),
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
