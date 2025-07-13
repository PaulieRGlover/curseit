import { Injectable, inject } from '@angular/core';
import { NavigationBehaviorOptions, Router } from '@angular/router';

import { ROUTES, RouteId, Routes } from './routes';

type NavigationPiece = Array<string> | ((...params: Array<string>) => Array<string>);

const PARAM_REGEX = /^:/;

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);

  constructor() {
    this.constructNavigationTree();
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

    processRoutes(ROUTES, ['/']);
  }

  private _navigationTree: {
    [key: symbol]: NavigationPiece;
  } = {};
}
