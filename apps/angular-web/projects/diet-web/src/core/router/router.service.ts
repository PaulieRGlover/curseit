import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationEnd, ActivationStart, Router } from '@angular/router';

import { filter, map } from 'rxjs';

import { Nullable } from '@curseit/types';

export type LeafRouteSnapshot = ActivatedRouteSnapshot & { firstChild: null };

@Injectable({ providedIn: 'root' })
export class RouterService {
  private router = inject(Router);

  leaf = computed(() => this._leaf());
  base = computed(() => this._base());
  tree = computed(() => this._tree());

  leafId = computed<Nullable<symbol>>(() => this._leaf()?.data?.['id'] ?? null);

  findInTreeById(id: symbol) {
    return this.tree()?.find(route => route.data?.['id'] === id) ?? null;
  }

  constructor() {
    this.handleRouterEvents();
  }

  private handleRouterEvents() {
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationStart),
        map((event: ActivationStart) => event.snapshot),
      )
      .subscribe(snapshot => {
        if (!snapshot.firstChild) {
          this._leaf.set(snapshot as LeafRouteSnapshot);
          this._tree.set(snapshot.pathFromRoot);
        }

        if (snapshot.parent && !snapshot.parent.parent) {
          this._base.set(snapshot);
        }
      });
  }

  private _leaf = signal<Nullable<LeafRouteSnapshot>>(null);
  private _base = signal<Nullable<ActivatedRouteSnapshot>>(null);
  private _tree = signal<Nullable<Array<ActivatedRouteSnapshot>>>(null);
}
