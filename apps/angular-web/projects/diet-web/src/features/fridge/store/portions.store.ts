import { Injectable, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import {
  addStoreCollectionItems,
  getStoreCollectionItemById,
  getStoreCollectionItems,
  getStoreCollectionItemsByIds,
  removeStoreCollectionItemById,
  removeStoreCollectionItems,
  updateStoreCollectionItemById,
  updateStoreCollectionItems,
} from '@/core/utils/store';

import { Portion, PortionErrors, Portions } from '../types/external/portion.types';
import { Variation } from '../types/external/variation.types';

@Injectable({ providedIn: 'root' })
export class PortionsStore {
  portions = signal<Nullable<Portions>>(null);
  loading = signal<Array<Portion['id']> | boolean>(false);
  failure = signal<Nullable<Failure>>(null);
  erroredPortions = signal<Array<PortionErrors>>([]);

  isPortionLoading(portionId: Portion['id']) {
    const loading_ = this.loading();
    return typeof loading_ === 'boolean' ? loading_ : loading_?.includes(portionId);
  }

  getPortionErrors(portionId: Portion['id']) {
    return getStoreCollectionItemById(this.erroredPortions, portionId);
  }

  getPortionsByIds(portionIds: Array<Portion['id']>) {
    return getStoreCollectionItemsByIds(this.portions, portionIds);
  }

  getPortionsByVariationId(variationId: Variation['id']) {
    return getStoreCollectionItems(this.portions, portion => portion.variationId === variationId);
  }

  getPortionsExcludingIds(portionIds: Array<Portion['id']>) {
    return getStoreCollectionItems(this.portions, ({ id }) => !portionIds.includes(id));
  }

  add(portions: Portions) {
    addStoreCollectionItems(this.portions, portions);
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

  addPortionErrors(portionErrors: PortionErrors) {
    addStoreCollectionItems(this.erroredPortions, [portionErrors]);
  }

  removePortionErrorsByIds(ids: Array<PortionErrors['id']>) {
    removeStoreCollectionItems(this.erroredPortions, ({ id }) => ids.includes(id));
  }

  reset() {
    this.portions.set(null);
    this.loading.set(false);
    this.failure.set(null);
    this.erroredPortions.set([]);
  }
}
