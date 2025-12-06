import { Injectable, inject } from '@angular/core';

import { FoodResource } from './resources/food.resource';
import { NutrientResource } from './resources/nutrient.resource';
import { PortionResource } from './resources/portion.resource';
import { VariationResource } from './resources/variation.resource';
import { FoodStore } from './store/food.store';
import { FoodsStore } from './store/foods.store';
import { NutrientsSearchStore } from './store/nutrients-search.store';
import { PortionsStore } from './store/portions.store';
import { VariationNutrientsStore } from './store/variation-nutrients.store';
import { VariationStore } from './store/variation.store';
import { VariationsStore } from './store/variations.store';
import { variationToVariationAbridged } from './transformers/variation-to-variation-abridged.transformer';
import { Food } from './types/external/food.types';
import { Portion } from './types/external/portion.types';
import { Variation, VariationNutrient } from './types/external/variation.types';
import { FoodUpdate } from './types/internal/food.types';
import { PortionUpdate, PortionsCreate } from './types/internal/portion.types';
import {
  VariationCreate,
  VariationNutrientCreate,
  VariationNutrientUpdate,
  VariationUpdate,
} from './types/internal/variation.types';
import { failureToPortionErrors } from './transformers/failure-to-portion-errors';

@Injectable({ providedIn: 'root' })
export class FridgeService {
  private foodResource = inject(FoodResource);
  private variationResource = inject(VariationResource);
  private portionResource = inject(PortionResource);
  private nutrientResource = inject(NutrientResource);
  private foodsStore = inject(FoodsStore);
  private foodStore = inject(FoodStore);
  private variationsStore = inject(VariationsStore);
  private portionsStore = inject(PortionsStore);
  private variationStore = inject(VariationStore);
  private variationNutrientsStore = inject(VariationNutrientsStore);
  private nutrientsSearchStore = inject(NutrientsSearchStore);

  async loadFoods() {
    this.foodsStore.loading.set(true);

    const result = await this.foodResource.read();
    if (result.success) {
      this.foodsStore.foods.set(result.success);
    } else {
      this.foodsStore.failure.set(result.failure);
    }

    this.foodsStore.loading.set(false);
  }

  async createFood() {
    this.foodStore.loading.set(true);

    const result = await this.foodResource.create({ body: {} });
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
    this.variationsStore.loading.set(true);

    const result = await this.foodResource.getById({ params: { foodId } });
    if (result.success) {
      const { variations, ...food } = result.success;
      this.foodStore.food.set(food);
      this.variationsStore.variations.set(variations);
    } else {
      this.foodStore.failure.set(result.failure);
    }

    this.foodStore.loading.set(false);
    this.variationsStore.loading.set(false);
  }

  async loadVariations(foodId: Food['id']) {
    this.variationsStore.loading.set(true);

    const result = await this.foodResource.readVariations({ params: { foodId } });
    if (result.success) {
      this.variationsStore.variations.set(result.success);
    } else {
      this.variationsStore.failure.set(result.failure);
    }

    this.variationsStore.loading.set(false);
  }

  async loadPortions(foodId: Food['id']) {
    this.portionsStore.loading.set(true);

    const result = await this.foodResource.readPortions({ params: { foodId } });
    if (result.success) {
      this.portionsStore.portions.set(result.success);
    } else {
      this.portionsStore.failure.set(result.failure);
    }

    this.portionsStore.loading.set(false);
  }

  async resetFood() {
    this.foodStore.food.set(null);
    this.variationsStore.variations.set(null);
    this.portionsStore.portions.set(null);
    this.variationNutrientsStore.variationNutrients.set(null);
  }

  async updateFood(update: FoodUpdate) {
    const foodId = this.foodStore.food()?.id;
    if (!foodId) {
      throw new Error('no foodId');
    }

    const result = await this.foodResource.update({ body: update, params: { foodId } });
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

    const result = await this.foodResource.createVariation({
      body: variationCreate,
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

    const result = await this.variationResource.getById({ params: { variationId } });
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
    const oldCounter = this.variationStore.variation()?.counter;

    if (!variationId) {
      throw new Error('no variationId');
    }

    const result = await this.variationResource.update({
      body: update,
      params: { variationId },
    });
    if (result.success) {
      this.variationStore.update(result.success);
      this.variationsStore.update(result.success.id, result.success);

      if (oldCounter !== result.success.counter) {
        this.portionsStore.updateByVariationId(variationId, { counter: result.success.counter });
      }
    } else {
      this.variationStore.failure.set(result.failure);
    }

    return result.success ? variationToVariationAbridged(result.success) : null;
  }

  async deleteVariation(variationId: Variation['id']) {
    if (this.variationStore.variation()?.id === variationId) {
      this.variationStore.loading.set(true);
    }

    const result = await this.variationResource.delete({ params: { variationId } });
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

  async addPortions(variationId: Variation['id'], count = 1) {
    const result = await this.portionResource.bulkCreate({
      body: Array.from({ length: count }, () => ({ variationId })),
    });
    if (result.success) {
      this.portionsStore.add(result.success);
    } else {
      this.portionsStore.failure.set(result.failure);
    }
  }

  async createPortions(payload: PortionsCreate) {
    this.portionsStore.loading.set(true);

    const result = await this.portionResource.bulkCreate({ body: payload });
    if (result.success) {
      this.portionsStore.add(result.success);
    } else {
      this.portionsStore.failure.set(result.failure);
    }

    this.portionsStore.loading.set(false);
  }

  async updatePortion(portionId: Portion['id'], update: PortionUpdate) {
    this.portionsStore.loading.set([portionId]);

    const result = await this.portionResource.update({
      params: { portionId },
      body: update,
    });
    if (result.success) {
      this.portionsStore.update(portionId, result.success);
      this.portionsStore.removePortionErrorsByIds([portionId]);
    } else {
      this.portionsStore.failure.set(result.failure);
      const portionErrors = failureToPortionErrors(result.failure, portionId);
      this.portionsStore.addPortionErrors(portionErrors);
    }

    this.portionsStore.loading.set(false);
  }

  async deletePortions(portionIds: Array<Portion['id']>) {
    this.portionsStore.loading.set(portionIds);

    const result = await this.portionResource.bulkDelete({ body: { ids: portionIds } });
    if (result.success) {
      this.portionsStore.removeByIds(portionIds);
      this.portionsStore.removePortionErrorsByIds(portionIds);
    } else {
      this.portionsStore.failure.set(result.failure);
    }

    this.portionsStore.loading.set(false);
  }

  async createVariationNutrient(nutrientCreate: VariationNutrientCreate) {
    const variationId = this.variationStore.variation()?.id;
    if (!variationId) {
      throw new Error('no variationId');
    }

    this.variationNutrientsStore.loading.set(true);

    const result = await this.variationResource.createNutrient({
      body: nutrientCreate,
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

    const result = await this.variationResource.updateNutrient({
      body: nutrientUpdate,
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

    const result = await this.variationResource.deleteNutrient({
      params: { variationId, variationNutrientId: id },
    });
    if (result.success) {
      this.variationNutrientsStore.remove(result.success.id);
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

    const result = await this.nutrientResource.get({
      query: { search, noRepeatIn: variationId },
    });
    if (result.success) {
      this.nutrientsSearchStore.foundNutrients.set(result.success);
    } else {
      this.nutrientsSearchStore.failure.set(result.failure);
    }

    this.nutrientsSearchStore.loading.set(false);
  }
}
