import { Injectable, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/types/external/failure.types';
import {
  addStoreCollectionItems,
  removeStoreCollectionItemById,
  updateStoreCollectionItems,
  updateStoreCollectionItemById,
  removeStoreCollectionItems,
} from '@/core/utils/store';

import { Portion, Portions } from '../types/external/portion.types';
import { Variation } from '../types/external/variation.types';

@Injectable({ providedIn: 'root' })
export class PortionsStore {
  portions = signal<Nullable<Portions>>(null);
  loading = signal<Array<Portion['id']> | boolean>(false);
  failure = signal<Nullable<Failure>>(null);

  isPortionLoading(portionId: Portion['id']) {
    const loading_ = this.loading();
    return typeof loading_ === 'boolean'
      ? loading_
      : loading_?.includes(portionId);
  }

  add(payload: Portions) {
    addStoreCollectionItems(this.portions, payload);
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

  removeByIds(ids: Array<Portion['id']>) {
    removeStoreCollectionItems(this.portions, ({ id }) => ids.includes(id));
  }
}
