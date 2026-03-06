import * as z from 'zod/v4-mini';

import { ingredients } from './recipe-project-ingredient.types';

export const recipeProject = z.object({
  id: z.string(),
  spendPortions: z.boolean(),
});
export type RecipeProject = z.infer<typeof recipeProject>;

export const recipeProjectWithIngredients = z.extend(recipeProject, {
  ingredients,
});
export type RecipeProjectWithIngredients = z.infer<typeof recipeProjectWithIngredients>;

export const recipeProjectWithIngredientsNullable = z.nullable(recipeProjectWithIngredients);
export type RecipeProjectWithIngredientsNullable = z.infer<
  typeof recipeProjectWithIngredientsNullable
>;
