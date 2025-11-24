import { Injectable, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { Failure } from '@/core/types/external/failure.types';

import { Portion, Portions } from '../types/external/portion.types';

@Injectable({ providedIn: 'root' })
export class PortionsStore {
  portions = signal<Nullable<Portions>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  add(portion: Portion) {
    this.portions.update(portions => [...(portions ?? []), portion]);
  }

  update(id: Portion['id'], update: Portion) {
    this.portions.update(portions => {
      return (
        portions?.map(portion => {
          return portion.id === id ? { ...portion, ...update } : portion;
        }) ?? null
      );
    });
  }

  delete(id: Portion['id']) {
    this.portions.set(this.portions()?.filter(portion => portion.id !== id) ?? null);
  }
}
