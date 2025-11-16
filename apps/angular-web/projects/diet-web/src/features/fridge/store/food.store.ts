import { Injectable, inject, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/types/external/failure.types';

import { Food } from '../types/external/food.types';

@Injectable({ providedIn: 'root' })
export class FoodStore {
  food = signal<Nullable<Food>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  update(update: Food) {
    this.food.update(food => {
      return food ? { ...food, ...update } : null;
    });
  }
}
