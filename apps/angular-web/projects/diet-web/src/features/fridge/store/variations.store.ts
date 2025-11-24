import { Injectable, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/types/external/failure.types';

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

  update(id: Variation['id'], update: VariationAbridged) {
    this.variations.update(variations => {
      return (
        variations?.map(variation => {
          return variation.id === id ? { id, name: update.name ?? variation.name } : variation;
        }) ?? null
      );
    });
  }

  delete(id: Variation['id']) {
    this.variations.set(this.variations()?.filter(variation => variation.id !== id) ?? null);
  }
}
