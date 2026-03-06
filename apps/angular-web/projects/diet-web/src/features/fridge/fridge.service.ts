import { Injectable, inject } from '@angular/core';

import { TimeoutError, firstValueFrom, timeout } from 'rxjs';

import { EventStore } from '@/core/stores/event.store';

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
import { failureToPortionErrors } from './transformers/failure-to-portion-errors';
import { portionToPortionAbridged } from './transformers/portion-to-portion-abridged';
import { portionsToCreateRecipeProjectFromPortions } from './transformers/portions-to-create-recipe-project-from-portions.transformer';
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

@Injectable({ providedIn: 'root' })
export class FridgeService {
  private eventStore = inject(EventStore);
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
      this.foodsStore.set(result.success);
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

    this.foodStore.loading.set(false);
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

  reset() {
    this.foodStore.reset();
    this.variationsStore.reset();
    this.variationStore.reset();
    this.portionsStore.reset();
    this.variationNutrientsStore.reset();
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
      this.foodsStore.removePortionsByFoodId(foodId);
    } else {
      this.foodStore.failure.set(result.failure);
    }
  }

  async removeFood() {
    const foodId = this.foodStore.food()?.id;
    if (!foodId) {
      throw new Error('no foodId');
    }

    const result = await this.foodResource.delete({ params: { foodId } });
    if (result.success) {
      this.foodsStore.remove(foodId);
      this.reset();
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

  async loadVariation(variationId: Variation['id']) {
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

  async removeVariation(variationId: Variation['id']) {
    if (this.variationStore.variation()?.id === variationId) {
      this.variationStore.loading.set(true);
    }

    const result = await this.variationResource.delete({ params: { variationId } });
    if (result.success) {
      if (result.success.id === this.variationStore.variation()?.id) {
        this.variationNutrientsStore.variationNutrients.set(null);
        this.variationStore.variation.set(null);

        const portions = this.portionsStore.getPortionsByVariationId(variationId);
        const portionIds = portions.map(({ id }) => id);
        this.foodsStore.removePortionsByIds(portionIds);

        this.eventStore.emit('fridge/discardPortionsFromCooking', portionIds);
      }

      this.variationsStore.remove(result.success.id);
    } else {
      this.variationStore.failure.set(result.failure);
    }

    this.variationStore.loading.set(false);
  }

  async addPortions(variationId: Variation['id'], count = 1) {
    await this.createPortions(Array.from({ length: count }, () => ({ variationId })));
  }

  async createPortions(payload: PortionsCreate) {
    const result = await this.portionResource.bulkCreate({ body: payload });
    if (result.success) {
      this.portionsStore.add(result.success);
      this.foodsStore.addPortions(result.success.map(portionToPortionAbridged));
    } else {
      this.portionsStore.failure.set(result.failure);
    }
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
      this.foodsStore.updatePortion(portionId, portionToPortionAbridged(result.success));
    } else {
      this.portionsStore.failure.set(result.failure);
      const portionErrors = failureToPortionErrors(result.failure, portionId);
      this.portionsStore.addPortionErrors(portionErrors);
    }

    this.portionsStore.loading.set(false);
  }

  async removePortions(portionIds: Array<Portion['id']>) {
    this.portionsStore.loading.set(portionIds);

    const result = await this.portionResource.bulkDelete({ body: { ids: portionIds } });
    if (result.success) {
      this.portionsStore.removeByIds(portionIds);
      this.portionsStore.removePortionErrorsByIds(portionIds);
      this.foodsStore.removePortionsByIds(portionIds);

      this.eventStore.emit('fridge/discardPortionsFromCooking', portionIds);
    } else {
      this.portionsStore.failure.set(result.failure);
    }

    this.portionsStore.loading.set(false);
  }

  async assignPortionsForCooking(portions: Array<Portion>) {
    this.portionsStore.loading.set(portions.map(({ id }) => id));

    this.eventStore.emit(
      'fridge/cookPortions',
      portionsToCreateRecipeProjectFromPortions(portions),
    );

    // TODO: organize better; maybe use portionsStore.failure?
    try {
      await firstValueFrom(
        this.eventStore.on('kitchen/portionsAssignedForCooking').pipe(timeout(5000)),
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error('Recipe creation timed out');
      }
    } finally {
      this.portionsStore.loading.set(false);
    }
  }

  async discardPortionsFromCooking(portions: Array<Portion>) {
    const portionIds = portions.map(({ id }) => id);
    this.portionsStore.loading.set(portionIds);

    this.eventStore.emit(
      'fridge/discardPortionsFromCooking',
      portionIds,
    );

    // TODO: organize better; maybe use portionsStore.failure?
    try {
      await firstValueFrom(
        this.eventStore.on('kitchen/portionsDiscardedFromCooking').pipe(timeout(5000)),
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error('Portion discarding timed out');
      }
    } finally {
      this.portionsStore.loading.set(false);
    }
  }

  async createVariationNutrient(nutrientCreate: VariationNutrientCreate) {
    const variationId = this.variationStore.variation()?.id;
    if (!variationId) {
      throw new Error('no variationId');
    }

    if (nutrientCreate.id) {
      this.variationNutrientsStore.addToLoading(nutrientCreate.id);
    }

    const result = await this.variationResource.createNutrient({
      body: nutrientCreate,
      params: { variationId },
    });
    if (result.success) {
      this.variationNutrientsStore.add(result.success);
    } else {
      this.variationNutrientsStore.failure.set(result.failure);
    }

    if (nutrientCreate.id) {
      this.variationNutrientsStore.removeFromLoading(nutrientCreate.id);
    }
  }

  async updateVariationNutrient(
    variationNutrientId: VariationNutrient['id'],
    update: VariationNutrientUpdate,
  ) {
    const variationId = this.variationStore.variation()?.id;
    if (!variationId) {
      throw new Error('no variationId');
    }

    if (this.variationNutrientsStore.compare(variationNutrientId, update)) {
      return;
    }

    this.nutrientsSearchStore.searchCache.set(null);
    this.variationNutrientsStore.addToLoading(variationNutrientId);

    const result = await this.variationResource.updateNutrient({
      body: update,
      params: { variationId, variationNutrientId },
    });
    if (result.success) {
      this.variationNutrientsStore.update(result.success.id, result.success);
    } else {
      this.variationNutrientsStore.failure.set(result.failure);
    }

    this.variationNutrientsStore.removeFromLoading(variationNutrientId);
  }

  async removeVariationNutrient(id: VariationNutrient['id']) {
    const variationId = this.variationStore.variation()?.id;
    if (!variationId) {
      throw new Error('no variationId');
    }

    this.variationNutrientsStore.addToLoading(id);

    const result = await this.variationResource.deleteNutrient({
      params: { variationId, variationNutrientId: id },
    });
    if (result.success) {
      this.variationNutrientsStore.remove(result.success.id);
    } else {
      this.variationNutrientsStore.failure.set(result.failure);
    }

    this.variationNutrientsStore.removeFromLoading(id);
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
