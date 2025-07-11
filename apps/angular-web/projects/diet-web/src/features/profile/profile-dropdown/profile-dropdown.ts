import { Component, inject } from '@angular/core';

import { AuthService } from '@/features/auth/auth.service';
import { RouterService } from '@/core/router/router.service';

@Component({
  selector: 'cid-profile-dropdown',
  templateUrl: './profile-dropdown.html',
  styleUrl: './profile-dropdown.scss',
})
export class ProfileDropdown {
  authService = inject(AuthService);
  routerService = inject(RouterService);

  async signOut() {
    await this.authService.signOut();
    this.routerService.replaceWith(this.routerService.ROUTES.AUTH.SIGN_IN);
  }
}
