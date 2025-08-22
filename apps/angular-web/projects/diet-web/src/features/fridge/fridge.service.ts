import { Injectable, inject } from '@angular/core';

import { Food, Variation } from './dto/external/food.dto';
import { FoodInput } from './dto/internal/food.dto';
import { NutrientCreate } from './dto/internal/nutrient.dto';
import { FridgeResource } from './fridge.resource';
import { FoodStore } from './store/food.store';
import { FoodsStore } from './store/foods.store';
import { NutrientsSearchStore } from './store/nutrients-search.store';
import { NutrientsStore } from './store/nutrients.store';
import { VariationStore } from './store/variation.store';
import { VariationsStore } from './store/variations.store';

@Injectable({ providedIn: 'root' })
export class FridgeService {
  private fridgeResource = inject(FridgeResource);
  private foodsStore = inject(FoodsStore);
  private foodStore = inject(FoodStore);
  private variationsStore = inject(VariationsStore);
  private variationStore = inject(VariationStore);
  private nutrientsStore = inject(NutrientsStore);
  private nutrientsSearchStore = inject(NutrientsSearchStore);

  async loadFoods() {
    this.foodsStore.loading.set(true);

    const result = await this.fridgeResource.getFoods();
    if (result.success) {
      this.foodsStore.foods.set(result.success);
    } else {
      this.foodsStore.failure.set(result.failure);
    }

    this.foodsStore.loading.set(false);
  }

  async createFood() {
    this.foodStore.loading.set(true);

    const result = await this.fridgeResource.createFood({});
    if (result.success) {
      const { variations, ...food } = result.success;
      this.foodStore.food.set(food);
      this.foodsStore.add({ ...food, portions: [] });
      this.variationsStore.variations.set(variations);
    } else {
      this.foodStore.failure.set(result.failure);
    }
  }

  async loadFood(foodId: Food['id']) {
    this.foodStore.loading.set(true);

    const result = await this.fridgeResource.getFood(undefined, { params: { foodId } });
    if (result.success) {
      const { variations, ...food } = result.success;
      this.foodStore.food.set(food);
      this.variationsStore.variations.set(variations);
    } else {
      this.foodStore.failure.set(result.failure);
    }

    this.foodStore.loading.set(false);
  }

  async updateFood(update: FoodInput) {
    const foodId = this.foodStore.food()?.id;
    if (!foodId) {
      return;
    }

    const result = await this.fridgeResource.updateFood(update, { params: { foodId } });
    if (result.success) {
      this.foodStore.update(result.success);
      this.foodsStore.update(result.success.id, result.success);
    } else {
      this.foodStore.failure.set(result.failure);
    }
  }

  async loadVariation(variationId: Variation['id']) {
    this.variationStore.loading.set(true);

    const result = await this.fridgeResource.getVariation(undefined, { params: { variationId } });
    if (result.success) {
      const { nutrients, ...variation } = result.success;
      this.variationStore.variation.set(variation);
      this.nutrientsStore.nutrients.set(nutrients);
    } else {
      this.variationStore.failure.set(result.failure);
    }

    this.variationStore.loading.set(false);
  }

  async createVariationNutrient(nutrientCreate: NutrientCreate) {
    const variationId = this.variationStore.variation()?.id;
    if (!variationId) {
      return;
    }

    this.nutrientsStore.loading.set(true);

    const result = await this.fridgeResource.createNutrient(nutrientCreate, {
      params: { variationId },
    });
    if (result.success) {
      const nutrients = this.nutrientsStore.nutrients() ?? [];
      this.nutrientsStore.nutrients.set([...nutrients, result.success]);
    } else {
      this.nutrientsStore.failure.set(result.failure);
    }

    this.nutrientsStore.loading.set(false);
  }

  async searchNutrients(search: string) {
    this.nutrientsSearchStore.loading.set(true);

    const result = await this.fridgeResource.searchNutrients(undefined, { query: { search } });
    if (result.success) {
      this.nutrientsSearchStore.foundNutrients.set(result.success);
    } else {
      this.nutrientsSearchStore.failure.set(result.failure);
    }

    this.nutrientsSearchStore.loading.set(false);
  }
}
