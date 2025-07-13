import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { NavigationService } from '@/core/router/navigation.service';
import { ROUTES } from '@/core/router/routes';

import { AuthService } from '../auth.service';

export const authenticated: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const navigationService = inject(NavigationService);

  return (
    authService.isAuthenticatedUnsafe() ||
    router.createUrlTree(navigationService.getNavigation(ROUTES.AUTH.SIGN_IN) as string[])
  );
};
