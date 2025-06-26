import { ROUTES_NAVIGATION } from '@/core/constants/router.constants';
import { AuthService } from '@/features/auth/auth.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cid-profile-dropdown',
  templateUrl: './profile-dropdown.html',
  styleUrl: './profile-dropdown.scss',
})
export class ProfileDropdown {
  authService = inject(AuthService);
  router = inject(Router);

  async signOut() {
    await this.authService.signOut();
    this.router.navigate(ROUTES_NAVIGATION.SIGN_IN, { replaceUrl: true });
  }
}
