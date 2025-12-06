import { Injectable, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { NutrientsAbridged } from '../types/external/nutrient.types';

@Injectable({ providedIn: 'root' })
export class NutrientsSearchStore {
  foundNutrients = signal<Nullable<NutrientsAbridged>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);
  searchCache = signal<Nullable<string>>(null);
}
