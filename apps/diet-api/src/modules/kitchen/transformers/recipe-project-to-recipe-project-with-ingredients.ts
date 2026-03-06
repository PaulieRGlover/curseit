import { Prisma } from '@curseit/diet-orm';

import { RecipeProjectWithIngredientsDto } from '../dto/kitchen.dto';

import { recipeProjectIngredientToDto } from './recipe-project-ingredient-to-dto';

export const recipeProjectToRecipeProjectWithIngredients = (
  kitchenProject: Prisma.RecipeProjectGetPayload<{
    include: {
      ingredients: {
        include: {
          foodPortion: {
            include: {
              foodVariation: true;
            };
          };
        };
      };
    };
  }>,
): RecipeProjectWithIngredientsDto => {
  return {
    ...kitchenProject,
    ingredients: kitchenProject.ingredients.map(recipeProjectIngredientToDto),
  };
};
