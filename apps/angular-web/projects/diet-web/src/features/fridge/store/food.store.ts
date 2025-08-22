import { Injectable, inject, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/dto/external/failure.dto';

import { Food } from '../dto/external/food.dto';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FoodStore {
  food = signal<Nullable<Food>>(null);
  food$ = toObservable(this.food);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  update(update: Food) {
    this.food.update(food => {
      return food ? { ...food, ...update } : null;
    });
  }
}
