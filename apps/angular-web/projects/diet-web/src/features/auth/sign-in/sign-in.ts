import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CiuiForm, CiuiInput } from '@curseit/ciui';

import { ROUTES_NAVIGATION } from '@/core/constants/router.constants';
import { AuthValidationService } from '@/core/validation/external/auth/auth-validation.service';
import { UserValidationService } from '@/core/validation/internal/user/user-validation.service';

import { AuthService } from '../auth.service';
import { ERROR_STATUS_CODES } from '@/core/constants/api.constants';

@Component({
  selector: 'cid-sign-in',
  imports: [ReactiveFormsModule, RouterLink, CiuiForm, CiuiInput],
  templateUrl: './sign-in.html',
  styleUrls: ['../auth.scss'],
})
export class SignIn {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authValidationService = inject(AuthValidationService);
  private userValidationService = inject(UserValidationService);

  signInData = new FormGroup({
    login: new FormControl('', { asyncValidators: this.userValidationService.login }),
    password: new FormControl('', { asyncValidators: this.userValidationService.password }),
  });
  loading = signal(false);

  async signIn(login: string, password: string) {
    this.loading.set(true);

    try {
      await this.authService.signIn(login, password);

      await this.router.navigate(ROUTES_NAVIGATION.DASHBOARD, { replaceUrl: true });
    } catch (error) {
      const errorResponse = await this.authValidationService.errorResponse(error);
      if (errorResponse?.status === ERROR_STATUS_CODES.UNAUTHORIZED) {
        this.signInData.setErrors({ unauthorized: errorResponse.error.message });
      }
    }

    this.loading.set(false);
  }

  onSubmit() {
    this.signIn(this.signInData.value.login!, this.signInData.value.password!);
  }
}
