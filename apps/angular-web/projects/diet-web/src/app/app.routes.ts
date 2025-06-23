import { Routes } from '@angular/router';

import { Auth, Dashboard } from '../features';
import { authRoutes } from '../features/auth/auth.routes';
import { ANIMATIONS, LAYOUTS, ROUTES_DECLARATION } from '@/core/constants/router.constants';

export const routes: Routes = [
  { path: '', redirectTo: ROUTES_DECLARATION.DASHBOARD, pathMatch: 'full' },
  {
    path: ROUTES_DECLARATION.DASHBOARD,
    component: Dashboard,
    data: {
      layout: LAYOUTS.HOME,
      animation: ANIMATIONS.DASHBOARD,
    },
  },
  {
    path: ROUTES_DECLARATION.AUTH,
    component: Auth,
    data: { layout: LAYOUTS.GUEST },
    children: authRoutes,
  },
];
