import { Routes } from '@angular/router';

import { SignUp } from './sign-up/sign-up';
import { SignIn } from './sign-in/sign-in';
import { ROUTES_DECLARATION } from '@/core/constants/router.constants';

export const authRoutes: Routes = [
  { path: '', redirectTo: ROUTES_DECLARATION.SIGN_IN, pathMatch: 'full' },
  { path: ROUTES_DECLARATION.SIGN_IN, component: SignIn },
  { path: ROUTES_DECLARATION.SIGN_UP, component: SignUp },
];
