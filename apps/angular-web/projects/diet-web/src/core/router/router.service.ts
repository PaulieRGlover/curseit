import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, Router } from '@angular/router';

import { BehaviorSubject, filter, map } from 'rxjs';

import { Nullable } from '@curseit/types';

export type LeafRouteSnapshot = ActivatedRouteSnapshot & { firstChild: null };

@Injectable({ providedIn: 'root' })
export class RouterService {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private getLeaf(snapshot: ActivatedRouteSnapshot): LeafRouteSnapshot {
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }

    return snapshot as LeafRouteSnapshot;
  }

  private getBase(snapshot: ActivatedRouteSnapshot): Nullable<ActivatedRouteSnapshot> {
    if (!snapshot.parent && !snapshot.firstChild) {
      return null;
    } else if (!snapshot.parent) {
      return snapshot.firstChild;
    }

    while (snapshot.parent && snapshot.parent.parent) {
      snapshot = snapshot.parent;
    }

    return snapshot;
  }

  private getTree(snapshot: ActivatedRouteSnapshot): Array<ActivatedRouteSnapshot> {
    const leaf = this.getLeaf(snapshot);
    return leaf.pathFromRoot;
  }

  private _leaf = new BehaviorSubject<LeafRouteSnapshot>(this.getLeaf(this.route.snapshot));
  private _base = new BehaviorSubject<Nullable<ActivatedRouteSnapshot>>(
    this.getBase(this.route.snapshot),
  );
  private _tree = new BehaviorSubject<Array<ActivatedRouteSnapshot>>(
    this.getTree(this.route.snapshot),
  );

  public leaf$ = this._leaf.asObservable();
  public base$ = this._base.asObservable();
  public tree$ = this._tree.asObservable();

  public get leaf() {
    return this._leaf.getValue();
  }

  public get base() {
    return this._base.getValue();
  }

  public get tree() {
    return this._tree.getValue();
  }

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        map((event: ActivationEnd) => event.snapshot),
        filter(snapshot => !snapshot.firstChild),
      )
      .subscribe(snapshot => {
        this._leaf.next(snapshot as LeafRouteSnapshot);
        this._tree.next(snapshot.pathFromRoot);
      });
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        map((event: ActivationEnd) => event.snapshot),
        filter(snapshot => Boolean(snapshot.parent && !snapshot.parent.parent)),
      )
      .subscribe(snapshot => this._base.next(snapshot));
  }
}
