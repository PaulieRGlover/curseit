import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, firstValueFrom } from 'rxjs';

import { ROUTES_NAVIGATION } from '@/core/constants/router.constants';
import { RouterService } from '@/core/router/router.service';

import { AuthService } from './auth.service';
import { authenticated } from './guards/authenticated.guard';

@Injectable({ providedIn: 'root' })
export class AuthFlowService {
  router = inject(Router);
  routeService = inject(RouterService);
  authService = inject(AuthService);

  private get isAuthProtected(): boolean {
    return (
      this.routeService.base?.routeConfig?.canActivate?.some(guard => {
        return guard === authenticated;
      }) ?? false
    );
  }

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

  private async checkPromisedAuthStatus() {
    if (!this.authService.isAuthenticated && this.isAuthProtected) {
      await this.authService.signOut();
      this.router.navigate(ROUTES_NAVIGATION.SIGN_IN, { replaceUrl: true });
    }
  }
}
