import { Injectable, computed, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { ERROR_STATUS_CODES } from '@/core/constants/api.constants';

import { Food } from '../types/external/food.types';

@Injectable({ providedIn: 'root' })
export class FoodStore {
  food = signal<Nullable<Food>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  notFound = computed(() => this.failure()?.status === ERROR_STATUS_CODES.NOT_FOUND);

  update(update: Food) {
    this.food.update(food => {
      return food ? { ...food, ...update } : null;
    });
  }
}
