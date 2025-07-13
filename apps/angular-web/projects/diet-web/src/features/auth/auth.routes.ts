import { Routes } from '@angular/router';

import { ROUTES } from '@/core/router/routes';

import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';

export const authRoutes: Routes = [
  { path: '', redirectTo: ROUTES.AUTH.SIGN_IN.declare(), pathMatch: 'full' },
  { path: ROUTES.AUTH.SIGN_IN.declare(), component: SignIn },
  { path: ROUTES.AUTH.SIGN_UP.declare(), component: SignUp },
];
