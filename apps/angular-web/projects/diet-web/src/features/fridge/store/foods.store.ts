import { Injectable, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { addStoreCollectionItems, updateStoreCollectionItemById } from '@/core/utils/store';

import { Food, FoodWithPortions, FoodsWithPortions } from '../types/external/food.types';

@Injectable({ providedIn: 'root' })
export class FoodsStore {
  foods = signal<Nullable<FoodsWithPortions>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  add(food: FoodWithPortions) {
    addStoreCollectionItems(this.foods, [food]);
  }

  update(id: Food['id'], update: Partial<FoodWithPortions>) {
    updateStoreCollectionItemById(this.foods, id, update);
  }
}
