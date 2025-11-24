import { Injectable, computed, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/types/external/failure.types';

import { Variation, VariationUpdate } from '../types/external/variation.types';

@Injectable({ providedIn: 'root' })
export class VariationStore {
  variation = signal<Nullable<Variation>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  energyAuto = computed(() => this.variation()?.energyAuto);

  update(update: VariationUpdate) {
    this.variation.update(variation => {
      return variation ? { ...variation, ...update } : null;
    });
  }
}
