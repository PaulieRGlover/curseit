import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationEnd, Router } from '@angular/router';

import { filter, map } from 'rxjs';

import { Nullable } from '@curseit/types';

export type LeafRouteSnapshot = ActivatedRouteSnapshot & { firstChild: null };

@Injectable({ providedIn: 'root' })
export class RouterService {
  private router = inject(Router);

  public readonly leaf = computed(() => this._leaf());
  public readonly base = computed(() => this._base());
  public readonly tree = computed(() => this._tree());

  constructor() {
    this.handleRouterEvents();
  }

  private handleRouterEvents() {
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        map((event: ActivationEnd) => event.snapshot),
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
