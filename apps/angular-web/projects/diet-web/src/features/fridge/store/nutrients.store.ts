import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { Nullable } from '@curseit/types';

import { VariationNutrient } from '../dto/external/food.dto';
import { nutrientToNutrientInput } from '../transformers/nutrient.transformers';
import { Failure } from '@/core/dto/external/failure.dto';

@Injectable({ providedIn: 'root' })
export class NutrientsStore {
  nutrients = signal<Nullable<Array<VariationNutrient>>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  nutrientInputs = computed(() => this.nutrients()?.map(nutrientToNutrientInput));
  nutrientInputs$ = toObservable(this.nutrientInputs);
}
