import { Injectable, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Nutrient } from '../dto/external/food.dto';
import { Failure } from '@/core/dto/external/failure.dto';

@Injectable({ providedIn: 'root' })
export class NutrientsSearchStore {
  foundNutrients = signal<Nullable<Array<Nutrient>>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);
}
