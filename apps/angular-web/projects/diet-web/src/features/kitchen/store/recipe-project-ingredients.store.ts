import { Injectable, computed, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import {
  addStoreCollectionItems,
  getStoreCollectionItems,
  getStoreCollectionItemsByIds,
  removeStoreCollectionItemsByIds,
  updateStoreCollectionItemById,
} from '@/core/utils/store';

import { Ingredient, Ingredients } from '../types/external/recipe-project-ingredient.types';

@Injectable({ providedIn: 'root' })
export class RecipeProjectIngredientsStore {
  ingredients = signal<Nullable<Ingredients>>(null);
  loading = signal<Array<Ingredient['id']> | boolean>(false);
  failure = signal<Nullable<Failure>>(null);

  ingredientIds = computed(() => this.ingredients()?.map(({ id }) => id) ?? []);

  getByPortionIds(portionIds: Array<Ingredient['foodPortionId']>) {
    return getStoreCollectionItems(
      this.ingredients,
      ({ foodPortionId }) => portionIds.includes(foodPortionId),
    );
  }

  isRecipeProjectIngredientLoading(id: Ingredient['id']) {
    const loading_ = this.loading();
    return typeof loading_ === 'boolean' ? loading_ : loading_?.includes(id);
  }

  addToLoading(id: Ingredient['id']) {
    this.loading.update(loading => [...(Array.isArray(loading) ? loading : []), id]);
  }

  removeFromLoading(variationNutrientId: Ingredient['id']) {
    this.loading.update(loading => {
      return Array.isArray(loading) ? loading.filter(id => id !== variationNutrientId) : loading;
    });
  }

  add(ingredients: Ingredients) {
    addStoreCollectionItems(this.ingredients, ingredients);
  }

  update(ingredientId: Ingredient['id'], update: Ingredient) {
    updateStoreCollectionItemById(this.ingredients, ingredientId, update);
  }

  remove(ingredientIds: Array<Ingredient['id']>) {
    removeStoreCollectionItemsByIds(this.ingredients, ingredientIds);
  }

  reset() {
    this.ingredients.set(null);
    this.loading.set(false);
    this.failure.set(null);
  }
}
