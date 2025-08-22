import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, firstValueFrom } from 'rxjs';

import { NavigationService } from '@/core/router/navigation.service';
import { RouterService } from '@/core/router/router.service';
import { ROUTES } from '@/core/router/routes';

import { AuthService } from './auth.service';
import { authenticated } from './guards/authenticated.guard';

@Injectable({ providedIn: 'root' })
export class AuthFlowService {
  private router = inject(Router);
  private routerService = inject(RouterService);
  private navigationService = inject(NavigationService);
  private authService = inject(AuthService);

  async initialize() {
    try {
      await this.authService.initialize();
    } finally {
      if (!this.router.navigated) {
        // wait for the router to finish navigation so that the base route can be determined
        await firstValueFrom(
          this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
        );
      }

      this.checkPromisedAuthStatus();
    }
  }

  async signIn() {
    // TODO: implement sign in with query params and redirects
  }

  private get isAuthProtected(): boolean {
    const baseConfig = this.routerService.base()?.routeConfig;

    return baseConfig?.canActivate?.some(guard => guard === authenticated) ?? false;
  }

  private async checkPromisedAuthStatus() {
    if (!this.authService.isAuthenticated() && this.isAuthProtected) {
      await this.authService.signOut();
      this.navigationService.replaceWith(ROUTES.AUTH.SIGN_IN);
    }
  }
}
