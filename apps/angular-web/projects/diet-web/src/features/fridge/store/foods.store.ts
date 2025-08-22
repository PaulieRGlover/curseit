import { Injectable, inject, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/dto/external/failure.dto';

import { Food, FoodsWithPortions, FoodWithPortions } from '../dto/external/food.dto';
import { FoodInput } from '../dto/internal/food.dto';

@Injectable({ providedIn: 'root' })
export class FoodsStore {
  foods = signal<Nullable<FoodsWithPortions>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  add(food: FoodWithPortions) {
    this.foods.update(foods => [...(foods ?? []), food]);
  }

  update(foodId: Food['id'], update: FoodInput) {
    this.foods.update(foods => {
      return (foods ?? []).map(food => {
        return food.id === foodId ? { ...food, ...update } : food;
      });
    });
  }
}
