import * as z from 'zod/v4-mini';

import { recipeProject } from '../external/recipe-project.types';

import { ingredientsCreate } from './recipe-project-ingredient.types';

export const recipeProjectCreate = z.partial(recipeProject);
export type RecipeProjectCreate = z.infer<typeof recipeProjectCreate>;

export const recipeProjectUpdate = z.omit(recipeProjectCreate, { id: true });
export type RecipeProjectUpdate = z.infer<typeof recipeProjectUpdate>;

export const recipeProjectWithIngredientsCreate = z.extend(recipeProjectCreate, {
  ingredients: ingredientsCreate,
});
export type RecipeProjectWithIngredientsCreate = z.infer<typeof recipeProjectWithIngredientsCreate>;
