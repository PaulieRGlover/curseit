import { Component, inject } from '@angular/core';

import { NavigationService } from '@/core/router/navigation.service';
import { ROUTES } from '@/core/router/routes';
import { AuthService } from '@/features/auth/auth.service';

@Component({
  selector: 'cid-profile-dropdown',
  templateUrl: './profile-dropdown.html',
  styleUrl: './profile-dropdown.scss',
})
export class ProfileDropdown {
  authService = inject(AuthService);
  navigationService = inject(NavigationService);

  async signOut() {
    await this.authService.signOut();
    this.navigationService.replaceWith(ROUTES.AUTH.SIGN_IN);
  }
}
