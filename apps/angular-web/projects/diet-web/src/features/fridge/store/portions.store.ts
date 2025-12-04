import { Injectable, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/types/external/failure.types';
import {
  addStoreCollectionItems,
  removeStoreCollectionItemById,
  updateStoreCollectionItems,
  updateStoreCollectionItemById,
} from '@/core/utils/store';

import { Portion, Portions } from '../types/external/portion.types';
import { Variation } from '../types/external/variation.types';

@Injectable({ providedIn: 'root' })
export class PortionsStore {
  portions = signal<Nullable<Portions>>(null);
  loading = signal<Portion['id'] | boolean>(false);
  failure = signal<Nullable<Failure>>(null);

  add(portion: Portion) {
    addStoreCollectionItems(this.portions, [portion]);
  }

  update(id: Portion['id'], update: Partial<Portion>) {
    updateStoreCollectionItemById(this.portions, id, update);
  }

  updateByVariationId(variationId: Variation['id'], update: Partial<Portion>) {
    updateStoreCollectionItems(
      this.portions,
      portion => portion.variationId === variationId,
      update,
    );
  }

  remove(id: Portion['id']) {
    removeStoreCollectionItemById(this.portions, id);
  }
}
