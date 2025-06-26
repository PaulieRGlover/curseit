import { Routes } from '@angular/router';

import { Auth, Dashboard } from '../features';
import { authRoutes } from '../features/auth/auth.routes';
import { LAYOUTS, ROUTES_DECLARATION } from '@/core/constants/router.constants';
import { authenticated } from '@/features/auth/guards/authenticated.guard';
import { notAuthenticated } from '@/features/auth/guards/not-authenticated.guard';

export const routes: Routes = [
  { path: '', redirectTo: ROUTES_DECLARATION.DASHBOARD, pathMatch: 'full' },
  {
    path: ROUTES_DECLARATION.DASHBOARD,
    component: Dashboard,
    data: { layout: LAYOUTS.HOME },
    canActivate: [authenticated],
  },
  {
    path: ROUTES_DECLARATION.AUTH,
    component: Auth,
    data: { layout: LAYOUTS.GUEST },
    children: authRoutes,
    canActivate: [notAuthenticated],
  },
];
