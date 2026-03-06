import { Injectable, computed, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { Variation } from '../types/external/variation.types';
import { VariationUpdate } from '../types/internal/variation.types';

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

  reset() {
    this.variation.set(null);
    this.loading.set(false);
    this.failure.set(null);
  }
}
