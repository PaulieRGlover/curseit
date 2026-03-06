import * as z from 'zod/v4-mini';

import { ingredient } from '../external/recipe-project-ingredient.types';

export const ingredientCreate = z.required(
  z.partial(
    z.pick(ingredient, {
      id: true,
      foodPortionId: true,
      sizeInGrams: true,
      sizeDisplayUnit: true,
      maximumSizeInGrams: true,
    }),
  ),
  { foodPortionId: true },
);
export type IngredientCreate = z.infer<typeof ingredientCreate>;

export const ingredientsCreate = z.array(ingredientCreate);
export type IngredientsCreate = z.infer<typeof ingredientsCreate>;
