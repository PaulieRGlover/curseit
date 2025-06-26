import { Routes } from '@angular/router';

import { ROUTES_DECLARATION } from '@/core/constants/router.constants';

import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';

export const authRoutes: Routes = [
  { path: '', redirectTo: ROUTES_DECLARATION.SIGN_IN, pathMatch: 'full' },
  { path: ROUTES_DECLARATION.SIGN_IN, component: SignIn },
  { path: ROUTES_DECLARATION.SIGN_UP, component: SignUp },
];
