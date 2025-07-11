import { Routes } from '@angular/router';

import { RouterService } from '@/core/router/router.service';
import { authenticated } from '@/features/auth/guards/authenticated.guard';
import { notAuthenticated } from '@/features/auth/guards/not-authenticated.guard';
import { Fridge } from '@/features/fridge/fridge';
import { fridgeRoutes } from '@/features/fridge/fridge.routes';

import { Auth, Dashboard } from '../features';
import { authRoutes } from '../features/auth/auth.routes';

export const LAYOUTS = {
  HOME: 'home',
  GUEST: 'guest',
} as const;

export const routes: Routes = [
  { path: '', redirectTo: RouterService.ROUTES.DASHBOARD.declare(), pathMatch: 'full' },
  {
    path: RouterService.ROUTES.AUTH.ROOT.declare(),
    component: Auth,
    children: authRoutes,
    data: { layout: LAYOUTS.GUEST },
    canActivate: [notAuthenticated],
  },
  {
    path: RouterService.ROUTES.DASHBOARD.declare(),
    component: Dashboard,
    data: { layout: LAYOUTS.HOME },
    canActivate: [authenticated],
  },
  {
    path: RouterService.ROUTES.FRIDGE.ROOT.declare(),
    component: Fridge,
    children: fridgeRoutes,
    data: { layout: LAYOUTS.HOME },
    canActivate: [authenticated],
  },
];
