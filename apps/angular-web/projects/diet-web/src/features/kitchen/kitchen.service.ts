import { Injectable, inject } from '@angular/core';

import { EventStore } from '@/core/stores/event.store';
import { PortionsUsedInRecipeProjectStore } from '@/shared/store/portions-used-in-recipe-project.store';

import { RecipeProjectIngredientResource } from './resources/recipe-project-ingredient.resource';
import { RecipeProjectResource } from './resources/recipe-project.resource';
import { RecipeProjectIngredientsStore } from './store/recipe-project-ingredients.store';
import { RecipeProjectStore } from './store/recipe-project.store';
import { Ingredients } from './types/external/recipe-project-ingredient.types';
import { IngredientsCreate } from './types/internal/recipe-project-ingredient.types';
import { RecipeProjectWithIngredientsCreate } from './types/internal/recipe-project.types';
import { DiscardPortionsFromCooking } from '@/core/events';

@Injectable({ providedIn: 'root' })
export class KitchenService {
  eventStore = inject(EventStore);
  recipeProjectResource = inject(RecipeProjectResource);
  recipeProjectIngredientResource = inject(RecipeProjectIngredientResource);
  portionsUsedInRecipeProjectStore = inject(PortionsUsedInRecipeProjectStore);
  recipeProjectStore = inject(RecipeProjectStore);
  recipeProjectIngredientsStore = inject(RecipeProjectIngredientsStore);

  constructor() {
    this.eventStore.on('fridge/cookPortions').subscribe(portions => {
      this._createOrUpdateRecipeProjectFromPortions(portions);
    });

    this.eventStore.on('fridge/discardPortionsFromCooking').subscribe(payload => {
      this._discardPortionsFromCooking(payload);
    });
  }

  async loadRecipeProject() {
    this.recipeProjectStore.loading.set(true);
    this.recipeProjectIngredientsStore.loading.set(true);

    const result = await this.recipeProjectResource.get();
    if (result.success) {
      const { ingredients, ...recipeProject } = result.success;
      this.recipeProjectStore.recipeProject.set(recipeProject);
      this.recipeProjectIngredientsStore.ingredients.set(ingredients);

      this.portionsUsedInRecipeProjectStore.portionIds.set(
        ingredients.map(({ foodPortionId }) => foodPortionId),
      );
    } else if (result.failure) {
      this.recipeProjectStore.failure.set(result.failure);
    }

    this.recipeProjectStore.loading.set(false);
    this.recipeProjectIngredientsStore.loading.set(false);
  }

  async createRecipeProject(recipeProject: RecipeProjectWithIngredientsCreate) {
    this.recipeProjectStore.loading.set(true);

    const result = await this.recipeProjectResource.create({ body: recipeProject });
    if (result.success) {
      const { ingredients, ...recipeProject } = result.success;
      this.recipeProjectStore.recipeProject.set(recipeProject);
      this.recipeProjectIngredientsStore.ingredients.set(ingredients);

      this.portionsUsedInRecipeProjectStore.portionIds.set(
        ingredients.map(({ foodPortionId }) => foodPortionId),
      );
    } else if (result.failure) {
      this.recipeProjectStore.failure.set(result.failure);
    }

    this.recipeProjectStore.loading.set(false);
    this.recipeProjectIngredientsStore.loading.set(false);
  }

  async addIngredients(ingredients: IngredientsCreate) {
    const result = await this.recipeProjectIngredientResource.create({ body: ingredients });
    if (result.success) {
      this.recipeProjectIngredientsStore.add(result.success);

      this.portionsUsedInRecipeProjectStore.add(
        result.success.map(({ foodPortionId }) => foodPortionId),
      );
    } else if (result.failure) {
      this.recipeProjectStore.failure.set(result.failure);
    }
  }

  async removeIngredients(ingredients: Ingredients) {
    const result = await this.recipeProjectIngredientResource.bulkDelete({
      body: { ids: ingredients.map(({ id }) => id) },
    });
    if (result.success) {
      this.recipeProjectIngredientsStore.remove(result.success.map(({ id }) => id));

      this.portionsUsedInRecipeProjectStore.remove(
        result.success.map(({ foodPortionId }) => foodPortionId),
      );
    } else if (result.failure) {
      this.recipeProjectStore.failure.set(result.failure);
    }
  }

  private async _createOrUpdateRecipeProjectFromPortions(
    ingredients: RecipeProjectWithIngredientsCreate['ingredients'],
  ) {
    if (this.recipeProjectStore.recipeProject()) {
      await this.addIngredients(ingredients);
    } else {
      await this.createRecipeProject({ ingredients });
    }

    this.eventStore.emit('kitchen/portionsAssignedForCooking');
  }

  private async _discardPortionsFromCooking(payload: DiscardPortionsFromCooking) {
    const { portionIds, arePortionsRemoved } = payload;
    const ingredients = this.recipeProjectIngredientsStore.getByPortionIds(portionIds);
    if (arePortionsRemoved) {
      this.recipeProjectIngredientsStore.remove(ingredients.map(({ id }) => id));

      this.portionsUsedInRecipeProjectStore.remove(
        ingredients.map(({ foodPortionId }) => foodPortionId),
      );
    } else {
      if (ingredients?.length) {
        await this.removeIngredients(ingredients);
      }

      this.eventStore.emit('kitchen/portionsDiscardedFromCooking');
    }
  }
}
