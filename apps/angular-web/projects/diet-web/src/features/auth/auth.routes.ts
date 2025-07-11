import { Routes } from '@angular/router';

import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { RouterService } from '@/core/router/router.service';

export const authRoutes: Routes = [
  { path: '', redirectTo: RouterService.ROUTES.AUTH.SIGN_IN.declare(), pathMatch: 'full' },
  { path: RouterService.ROUTES.AUTH.SIGN_IN.declare(), component: SignIn },
  { path: RouterService.ROUTES.AUTH.SIGN_UP.declare(), component: SignUp },
];
