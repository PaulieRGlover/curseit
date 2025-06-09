import { Routes } from '@angular/router';
import { Auth, Dashboard } from '../features';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    data: { layout: 'home' },
  },
  {
    path: 'auth',
    component: Auth,
    data: { layout: 'guest' },
    children: [
      {
        path: 'lala',
        component: Dashboard,
      },
    ],
  }
];
