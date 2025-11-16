import { Injectable, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/types/external/failure.types';

import { Food, FoodsWithPortions, FoodWithPortions } from '../types/external/food.types';
import { FoodInput } from '../types/internal/food.types';

@Injectable({ providedIn: 'root' })
export class FoodsStore {
  foods = signal<Nullable<FoodsWithPortions>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  add(food: FoodWithPortions) {
    this.foods.update(foods => [...(foods ?? []), food]);
  }

  update(id: Food['id'], update: FoodInput) {
    this.foods.update(foods => {
      return foods?.map(food => {
        return food.id === id ? { ...food, ...update } : food;
      }) ?? null;
    });
  }
}
