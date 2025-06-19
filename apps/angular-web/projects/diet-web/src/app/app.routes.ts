import { Routes } from '@angular/router';

import { Auth, Dashboard } from '../features';
import { authRoutes } from '../features/auth/auth.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: Dashboard,
    data: { layout: 'home' },
  },
  {
    path: 'auth',
    component: Auth,
    data: { layout: 'guest' },
    children: authRoutes,
  },
];
