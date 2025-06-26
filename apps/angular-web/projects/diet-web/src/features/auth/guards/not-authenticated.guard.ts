import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ROUTES_NAVIGATION } from '@/core/constants/router.constants';

import { AuthService } from '../auth.service';

export const notAuthenticated: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return (
    !authService.isAuthenticatedUnsafe ||
    router.createUrlTree(ROUTES_NAVIGATION.DASHBOARD)
  );
};
