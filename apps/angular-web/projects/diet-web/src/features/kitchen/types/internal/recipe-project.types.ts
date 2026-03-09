import * as z from 'zod/v4-mini';

import { ingredientsCreate } from './recipe-project-ingredient.types';

export const spendPortions = z.optional(z.boolean());

export const recipeProjectCreate = z.object({ spendPortions });
export type RecipeProjectCreate = z.infer<typeof recipeProjectCreate>;

export const recipeProjectUpdate = recipeProjectCreate;
export type RecipeProjectUpdate = z.infer<typeof recipeProjectUpdate>;

export const recipeProjectWithIngredientsCreate = z.extend(recipeProjectCreate, {
  ingredients: ingredientsCreate,
});
export type RecipeProjectWithIngredientsCreate = z.infer<typeof recipeProjectWithIngredientsCreate>;
