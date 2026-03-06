import { Injectable, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { addStoreCollectionItems, removeStoreCollectionItems } from '@/core/utils/store';

@Injectable({ providedIn: 'root' })
export class PortionsUsedInRecipeProjectStore {
  portionIds = signal<Nullable<Array<string>>>(null);

  add(ids: Array<string>) {
    addStoreCollectionItems(this.portionIds, ids);
  }

  remove(ids: Array<string>) {
    removeStoreCollectionItems(this.portionIds, id => ids.includes(id));
  }
}
