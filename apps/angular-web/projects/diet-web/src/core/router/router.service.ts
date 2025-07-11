import { Injectable, computed, inject, signal } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivationEnd,
  NavigationBehaviorOptions,
  Router,
} from '@angular/router';

import { filter, map } from 'rxjs';

import { Nullable } from '@curseit/types';

export type LeafRouteSnapshot = ActivatedRouteSnapshot & { firstChild: null };

type RouteId = { id: symbol; declare: () => string };
type Route = RouteId | { ROOT: RouteId; [key: Uppercase<string>]: Route };
type Routes = Exclude<Route, RouteId>;
type NavigationPiece = Array<string> | ((...params: Array<string>) => Array<string>);

const r = ([route]: TemplateStringsArray): RouteId => ({ id: Symbol(route), declare: () => route });

const PARAM_REGEX = /^:/;

@Injectable({ providedIn: 'root' })
export class RouterService {
  public static ROUTES = {
    ROOT: r`/`,
    DASHBOARD: r`dashboard`,
    AUTH: {
      ROOT: r`auth`,
      SIGN_IN: r`sign-in`,
      SIGN_UP: r`sign-up`,
    },
    FRIDGE: {
      ROOT: r`fridge`,
      FOOD: r`:foodId`,
    },
  } as const;

  private router = inject(Router);

  public readonly leaf = computed(() => this._leaf());
  public readonly base = computed(() => this._base());
  public readonly tree = computed(() => this._tree());

  public get ROUTES() {
    return RouterService.ROUTES;
  }

  constructor() {
    this.constructNavigationTree();
    this.handleRouterEvents();
  }

  public getNavigation(routeId: RouteId): NavigationPiece {
    const navigation = this._navigationTree[routeId.id];
    if (!navigation) {
      throw new Error('No such route');
    }

    return navigation;
  }

  public goTo(routeId: RouteId, ...params: Array<string>) {
    return this.navigate(routeId, {}, ...params);
  }

  public replaceWith(routeId: RouteId, ...params: Array<string>) {
    return this.navigate(routeId, { replaceUrl: true }, ...params);
  }

  private navigate(routeId: RouteId, options: NavigationBehaviorOptions, ...params: Array<string>) {
    const navigation = this.getNavigation(routeId);

    if (Array.isArray(navigation)) {
      return this.router.navigate(navigation, options);
    } else {
      return this.router.navigate(navigation(...params), options);
    }
  }

  private constructNavigationTree() {
    const constructNavigation = (root: NavigationPiece, appendix: string): NavigationPiece => {
      if (typeof root === 'function') {
        if (PARAM_REGEX.test(appendix)) {
          return (...params: Array<string>) => [
            ...root(...params.slice(0, params.length - 1)),
            params.at(-1) as string,
          ];
        } else {
          return (...params: Array<string>) => [...root(...params), appendix];
        }
      } else {
        if (PARAM_REGEX.test(appendix)) {
          return (param: string) => [...root, param];
        } else {
          return [...root, appendix];
        }
      }
    };

    const processLeaf = (leaf: RouteId, root: NavigationPiece) => {
      this._navigationTree[leaf.id] = constructNavigation(root, leaf.declare());
    };

    const processParent = (parent: Routes, root: NavigationPiece) => {
      const newRoot = constructNavigation(root, parent.ROOT.declare());
      this._navigationTree[parent.ROOT.id] = newRoot;
      return newRoot;
    };

    const processRoutes = (routes: Routes, root: NavigationPiece) => {
      (Object.keys(routes) as Array<Uppercase<string>>).forEach(routeKey => {
        if (routeKey === 'ROOT') {
          return;
        }

        const route = routes[routeKey];
        if (!('ROOT' in route)) {
          processLeaf(route, root);
        } else {
          const newRoot = processParent(route, root);
          processRoutes(route, newRoot);
        }
      });
    };

    processRoutes(RouterService.ROUTES, ['/']);
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
  private _navigationTree: {
    [key: symbol]: NavigationPiece;
  } = {};
}
