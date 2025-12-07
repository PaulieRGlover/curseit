import { Injectable, computed, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import {
  addStoreCollectionItems,
  getStoreCollectionItemById,
  removeStoreCollectionItems,
  updateStoreCollectionItemById,
} from '@/core/utils/store';

import { Food, FoodWithPortions, Foods, FoodsWithPortions } from '../types/external/food.types';
import {
  PortionAbridged,
  PortionsAbridged,
  portion,
  portions,
} from '../types/external/portion.types';

type PortionAbridgedStoreProxy = PortionAbridged & { foodId: Food['id'] };
type PortionsAbridgedStoreProxy = Array<PortionAbridgedStoreProxy>;

@Injectable({ providedIn: 'root' })
export class FoodsStore {
  foods = computed(() => this._foods());
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  set(foods: FoodsWithPortions) {
    this._foods.set(foods.map(({ portions, ...food }) => food));

    const portions = foods.flatMap(({ portions }) => portions);
    this._portions.set(portions);
  }

  getById(foodId: Food['id']) {
    return getStoreCollectionItemById(this._foods, foodId);
  }

  getPortionsByFoodId(foodId: Food['id']) {
    return this._portions()?.filter(portion => portion.foodId === foodId) ?? null;
  }

  add({ portions, ...food }: FoodWithPortions) {
    addStoreCollectionItems(this._foods, [food]);
    if (portions) {
      addStoreCollectionItems(this._portions, portions);
    }
  }

  update(id: Food['id'], { portions, ...update }: Partial<FoodWithPortions>) {
    updateStoreCollectionItemById(this._foods, id, update);
    if (portions) {
      this._updatePortionsByFoodId(id, portions);
    }
  }

  addPortions(portions: PortionsAbridged) {
    addStoreCollectionItems(this._portions, portions);
  }

  updatePortion(portionId: PortionAbridged['id'], update: Partial<PortionAbridged>) {
    updateStoreCollectionItemById(this._portions, portionId, update);
  }

  removePortionsByIds(portionIds: Array<PortionAbridged['id']>) {
    removeStoreCollectionItems(this._portions, ({ id }) => portionIds.includes(id));
  }

  private _updatePortionsByFoodId(foodId: Food['id'], portions: FoodWithPortions['portions']) {
    removeStoreCollectionItems(this._portions, portion => portion.foodId === foodId);
    addStoreCollectionItems(this._portions, portions);
  }

  private _foods = signal<Nullable<Foods>>(null);
  private _portions = signal<Nullable<PortionsAbridgedStoreProxy>>(null);
}
