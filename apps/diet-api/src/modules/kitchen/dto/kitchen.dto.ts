import { createZodDto } from '@anatine/zod-nestjs';

import { z } from 'zod';

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
  foodPortionId: z.string(),
  variationId: z.string(),
  foodId: z.string(),
  counter: z.string(),
  freshness: z.number().min(0).max(1).nullable(),
  sizeInGrams: z.number(),
  sizeDisplayUnit: FoodUnitSchema,
  maximumSizeInGrams: z.number(),
});
export class RecipeProjectIngredientDto extends createZodDto(RecipeProjectIngredientSchema) {}

export const RecipeProjectIngredientsSchema = z.array(RecipeProjectIngredientSchema);
export class RecipeProjectIngredientsDto extends createZodDto(
  RecipeProjectIngredientsSchema,
) {}

export const RecipeProjectIngredientBulkDeleteSchema = z.object({
  ids: z.array(recipeProjectIngredientId),
});
export class RecipeProjectIngredientBulkDeleteDto extends createZodDto(RecipeProjectIngredientBulkDeleteSchema) {}

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
  .required({ foodPortionId: true });

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
