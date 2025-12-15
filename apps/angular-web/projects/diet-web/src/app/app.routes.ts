import { Routes } from '@angular/router';

import { ROUTES } from '@/core/router/routes';
import { authRoutes } from '@/features/auth/auth.routes';
import { authenticated } from '@/features/auth/guards/authenticated.guard';
import { notAuthenticated } from '@/features/auth/guards/not-authenticated.guard';
import { fridgeRoutes } from '@/features/fridge/fridge.routes';
import { kitchenRoutes } from '@/features/kitchen/kitchen.routes';

export const LAYOUTS = {
  HOME: 'home',
  GUEST: 'guest',
} as const;

export const routes: Routes = [
  { path: '', redirectTo: ROUTES.DASHBOARD.declare(), pathMatch: 'full' },
  {
    path: ROUTES.AUTH.ROOT.declare(),
    loadComponent: async () => (await import('../features/auth/auth')).CidAuth,
    children: authRoutes,
    data: { layout: LAYOUTS.GUEST },
    canActivate: [notAuthenticated],
  },
  {
    path: ROUTES.DASHBOARD.declare(),
    loadComponent: async () => (await import('../features/dashboard/dashboard')).CidDashboard,
    data: { layout: LAYOUTS.HOME },
    canActivate: [authenticated],
  },
  {
    path: ROUTES.FRIDGE.ROOT.declare(),
    loadComponent: async () => (await import('../features/fridge/fridge')).CidFridge,
    children: fridgeRoutes,
    data: { layout: LAYOUTS.HOME },
    canActivate: [authenticated],
  },
  {
    path: ROUTES.KITCHEN.ROOT.declare(),
    loadComponent: async () => (await import('../features/kitchen/kitchen')).CidKitchen,
    children: kitchenRoutes,
    data: { layout: LAYOUTS.HOME },
    canActivate: [authenticated],
  },
];
