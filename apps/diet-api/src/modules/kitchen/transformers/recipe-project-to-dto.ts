import { RecipeProject } from '@curseit/diet-orm';
import { RecipeProjectDto } from '../dto/kitchen.dto';

export const recipeProjectToDto = (recipeProject: RecipeProject): RecipeProjectDto => {
  const { id, spendPortions } = recipeProject;
  return { id, spendPortions };
};
