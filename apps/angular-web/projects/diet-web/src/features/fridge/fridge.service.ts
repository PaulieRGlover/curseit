import { Injectable, inject } from '@angular/core';

import { FridgeResource } from './fridge.resource';
import { FoodStore } from './store/food.store';
import { FoodsStore } from './store/foods.store';
import { NutrientsSearchStore } from './store/nutrients-search.store';
import { VariationNutrientsStore } from './store/variation-nutrients.store';
import { VariationStore } from './store/variation.store';
import { VariationsStore } from './store/variations.store';
import { variationToVariationAbridged } from './transformers/variation-to-variation-abridged.transformer';
import {
  Food,
  Variation,
  VariationCreate,
  VariationNutrient,
  VariationUpdate,
} from './types/external/food.types';
import { FoodUpdate } from './types/internal/food.types';
import { VariationNutrientCreate, VariationNutrientUpdate } from './types/internal/nutrient.types';

@Injectable({ providedIn: 'root' })
export class FridgeService {
  private fridgeResource = inject(FridgeResource);
  private foodsStore = inject(FoodsStore);
  private foodStore = inject(FoodStore);
  private variationsStore = inject(VariationsStore);
  private variationStore = inject(VariationStore);
  private variationNutrientsStore = inject(VariationNutrientsStore);
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

  async resetFood() {
    this.foodStore.food.set(null);
    this.variationsStore.variations.set(null);
    this.variationNutrientsStore.variationNutrients.set(null);
  }

  async updateFood(update: FoodUpdate) {
    const foodId = this.foodStore.food()?.id;
    if (!foodId) {
      throw new Error('no foodId');
    }

    const result = await this.fridgeResource.updateFood(update, { params: { foodId } });
    if (result.success) {
      this.foodStore.update(result.success);
      this.foodsStore.update(result.success.id, result.success);
    } else {
      this.foodStore.failure.set(result.failure);
    }
  }

  async createVariation(variationCreate: VariationCreate) {
    const foodId = this.foodStore.food()?.id;
    if (!foodId) {
      throw new Error('no foodId');
    }

    this.variationsStore.loading.set(true);

    const result = await this.fridgeResource.createVariation(variationCreate, {
      params: { foodId },
    });
    if (result.success) {
      this.variationsStore.add(variationToVariationAbridged(result.success));
    } else {
      this.variationsStore.failure.set(result.failure);
    }

    this.variationsStore.loading.set(false);

    return result.success ? variationToVariationAbridged(result.success) : null;
  }

  async getVariation(variationId: Variation['id']) {
    this.variationNutrientsStore.variationNutrients.set(null);

    this.variationStore.loading.set(true);

    const result = await this.fridgeResource.getVariation(undefined, { params: { variationId } });
    if (result.success) {
      const { nutrients, ...variation } = result.success;
      this.variationStore.variation.set(variation);
      this.variationNutrientsStore.variationNutrients.set(nutrients);
    } else {
      this.variationStore.failure.set(result.failure);
    }

    this.variationStore.loading.set(false);
  }

  async updateVariation(
    update: VariationUpdate,
    variationId = this.variationStore.variation()?.id,
  ) {
    if (!variationId) {
      throw new Error('no variationId');
    }

    const result = await this.fridgeResource.updateVariation(update, { params: { variationId } });
    if (result.success) {
      this.variationStore.update(result.success);
      this.variationsStore.update(result.success.id, result.success);
    } else {
      this.variationStore.failure.set(result.failure);
    }

    return result.success ? variationToVariationAbridged(result.success) : null;
  }

  async deleteVariation(variationId: Variation['id']) {
    if (this.variationStore.variation()?.id === variationId) {
      this.variationStore.loading.set(true);
    }

    const result = await this.fridgeResource.deleteVariation(undefined, {
      params: { variationId },
    });
    if (result.success) {
      if (result.success.id === this.variationStore.variation()?.id) {
        this.variationNutrientsStore.variationNutrients.set(null);
        this.variationStore.variation.set(null);
      }

      this.variationsStore.delete(result.success.id);
    } else {
      this.variationStore.failure.set(result.failure);
    }

    this.variationStore.loading.set(false);
  }

  async createVariationNutrient(nutrientCreate: VariationNutrientCreate) {
    const variationId = this.variationStore.variation()?.id;
    if (!variationId) {
      throw new Error('no variationId');
    }

    this.variationNutrientsStore.loading.set(true);

    const result = await this.fridgeResource.createNutrient(nutrientCreate, {
      params: { variationId },
    });
    if (result.success) {
      this.variationNutrientsStore.add(result.success);
    } else {
      this.variationNutrientsStore.failure.set(result.failure);
    }

    this.variationNutrientsStore.loading.set(false);

    return result.success ?? null;
  }

  async updateVariationNutrient(nutrientUpdate: VariationNutrientUpdate) {
    const variationId = this.variationStore.variation()?.id;
    if (!variationId) {
      throw new Error('no variationId');
    }

    if (this.variationNutrientsStore.compare(nutrientUpdate.id, nutrientUpdate)) {
      return;
    }

    this.nutrientsSearchStore.searchCache.set(null);
    this.variationNutrientsStore.loading.set(true);

    const result = await this.fridgeResource.updateNutrient(nutrientUpdate, {
      params: { variationId, variationNutrientId: nutrientUpdate.id },
    });
    if (result.success) {
      this.variationNutrientsStore.update(result.success.id, result.success);
    } else {
      this.variationNutrientsStore.failure.set(result.failure);
    }

    this.variationNutrientsStore.loading.set(false);

    return result.success;
  }

  async deleteVariationNutrient(id: VariationNutrient['id']) {
    const variationId = this.variationStore.variation()?.id;
    if (!variationId) {
      throw new Error('no variationId');
    }

    this.variationNutrientsStore.loading.set(true);

    const result = await this.fridgeResource.deleteNutrient(undefined, {
      params: { variationId, variationNutrientId: id },
    });
    if (result.success) {
      this.variationNutrientsStore.delete(result.success.id);
    } else {
      this.variationNutrientsStore.failure.set(result.failure);
    }

    this.variationNutrientsStore.loading.set(false);
  }

  async searchNutrients(search?: string) {
    const variationId = this.variationStore.variation()?.id;
    if (!variationId) {
      throw new Error('no variationId');
    }

    if (this.nutrientsSearchStore.searchCache() === (search ?? '')) {
      return;
    }

    this.nutrientsSearchStore.searchCache.set(search ?? '');

    this.nutrientsSearchStore.loading.set(true);

    const result = await this.fridgeResource.searchNutrientsNotRepeated(undefined, {
      params: { variationId },
      query: { search },
    });
    if (result.success) {
      this.nutrientsSearchStore.foundNutrients.set(result.success);
    } else {
      this.nutrientsSearchStore.failure.set(result.failure);
    }

    this.nutrientsSearchStore.loading.set(false);
  }
}
