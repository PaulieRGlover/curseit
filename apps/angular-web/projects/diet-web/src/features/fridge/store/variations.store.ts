import { Injectable, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { updateStoreCollectionItemById } from '@/core/utils/store';

import {
  Variation,
  VariationAbridged,
  VariationsAbridged,
} from '../types/external/variation.types';

@Injectable({ providedIn: 'root' })
export class VariationsStore {
  variations = signal<Nullable<VariationsAbridged>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  add(variation: VariationAbridged) {
    this.variations.update(variations => [...(variations ?? []), variation]);
  }

  update(id: Variation['id'], update: Partial<VariationAbridged>) {
    updateStoreCollectionItemById(this.variations, id, update);
  }

  remove(id: Variation['id']) {
    this.variations.set(this.variations()?.filter(variation => variation.id !== id) ?? null);
  }

  reset() {
    this.variations.set(null);
    this.loading.set(false);
    this.failure.set(null);
  }
}
