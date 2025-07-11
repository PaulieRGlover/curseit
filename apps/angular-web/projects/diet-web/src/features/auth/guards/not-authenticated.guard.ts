import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { RouterService } from '@/core/router/router.service';

export const notAuthenticated: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const routerService = inject(RouterService);

  return (
    !authService.isAuthenticatedUnsafe() ||
    router.createUrlTree(routerService.getNavigation(routerService.ROUTES.DASHBOARD) as string[])
  );
};
