import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { RouterService } from '@/core/router/router.service';

import { AuthService } from '../auth.service';

export const authenticated: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const routerService = inject(RouterService);

  return (
    authService.isAuthenticatedUnsafe() ||
    router.createUrlTree(routerService.getNavigation(routerService.ROUTES.AUTH.SIGN_IN) as string[])
  );
};
