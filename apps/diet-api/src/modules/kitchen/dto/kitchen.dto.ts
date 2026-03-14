import { createZodDto } from '@anatine/zod-nestjs';

import { z } from 'zod';

import { DAY } from '@curseit/time';

import { FoodUnitSchema } from '@/modules/fridge/dto/fridge.dto';

export const RecipeProjectSchema = z.object({
  id: z.string(),
  spendPortions: z.boolean(),
});
export class RecipeProjectDto extends createZodDto(RecipeProjectSchema) {}

export const RecipeProjectCreateSchema = RecipeProjectSchema.partial();

export const RecipeProjectUpdateSchema = RecipeProjectSchema.omit({ id: true }).partial();
export class RecipeProjectUpdateDto extends createZodDto(RecipeProjectUpdateSchema) {}

const recipeProjectIngredientId = z.string();

export const RecipeProjectIngredientSchema = z.object({
  id: recipeProjectIngredientId,
  foodId: z.string(),
  foodVariationId: z.string().nullable(),
  foodPortionId: z.string().nullable(),
  counter: z.string().optional(),
  freshness: z.number().min(0).max(1).nullable().optional(),
  sizeInGrams: z.number().positive(),
  sizeDisplayUnit: FoodUnitSchema,
  maximumSizeInGrams: z.number().optional(),
});
export class RecipeProjectIngredientDto extends createZodDto(RecipeProjectIngredientSchema) {}

export const RecipeProjectIngredientsSchema = z.array(RecipeProjectIngredientSchema);
export class RecipeProjectIngredientsDto extends createZodDto(RecipeProjectIngredientsSchema) {}

export const RecipeProjectIngredientBulkDeleteSchema = z.object({
  ids: z.array(recipeProjectIngredientId),
});
export class RecipeProjectIngredientBulkDeleteDto extends createZodDto(
  RecipeProjectIngredientBulkDeleteSchema,
) {}

export const RecipeProjectWithIngredientsSchema = RecipeProjectSchema.extend({
  ingredients: z.array(RecipeProjectIngredientSchema),
});
export class RecipeProjectWithIngredientsDto extends createZodDto(
  RecipeProjectWithIngredientsSchema,
) {}

export const RecipeProjectIngredientCreateSchema = RecipeProjectIngredientSchema.pick({
  id: true,
  foodPortionId: true,
  sizeInGrams: true,
  sizeDisplayUnit: true,
})
  .partial()
  .extend({ foodPortionId: z.string() });

export const RecipeProjectIngredientsCreateSchema = z.array(RecipeProjectIngredientCreateSchema);
export class RecipeProjectIngredientsCreateDto extends createZodDto(
  RecipeProjectIngredientsCreateSchema,
) {}

export const RecipeProjectWithIngredientsCreateSchema = RecipeProjectCreateSchema.extend({
  ingredients: z.array(RecipeProjectIngredientCreateSchema),
});
export class RecipeProjectWithIngredientsCreateDto extends createZodDto(
  RecipeProjectWithIngredientsCreateSchema,
) {}

const recipeId = z.string();

export const RecipeSchema = z.object({
  id: recipeId,
  title: z.string().optional(),
  timeToCook: z
    .number()
    .positive()
    .max(DAY * 365)
    .optional(),
  timeToSpoil: z.number().positive().optional(),
  description: z.string().optional(),
});

export const RecipeCreateSchema = RecipeSchema.partial();

const recipeIngredientId = z.string();

export const RecipeIngredientSchema = z.object({
  id: recipeIngredientId,
  sizeInGrams: z.number().positive(),
  sizeDisplayUnit: FoodUnitSchema,
  foodId: z.string(),
});
