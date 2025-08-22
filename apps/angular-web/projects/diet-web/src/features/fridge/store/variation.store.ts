import { Injectable, computed, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/dto/external/failure.dto';

import { Variation } from '../dto/external/food.dto';

@Injectable({ providedIn: 'root' })
export class VariationStore {
  variation = signal<Nullable<Variation>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);
}
