import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CiuiForm, CiuiInput } from '@curseit/ciui';

import { ERROR_STATUS_CODES } from '@/core/constants/api.constants';
import { ROUTES_NAVIGATION } from '@/core/constants/router.constants';
import { AuthValidationService } from '@/core/validation/external/auth/auth-validation.service';
import { UserValidationService } from '@/core/validation/internal/user/user-validation.service';

import { AuthService } from '../auth.service';

@Component({
  selector: 'cid-sign-up',
  imports: [ReactiveFormsModule, RouterLink, CiuiForm, CiuiInput],
  templateUrl: './sign-up.html',
  styleUrls: ['../auth.scss'],
})
export class SignUp {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authValidationService = inject(AuthValidationService);
  private userValidationService = inject(UserValidationService);

  signUpData = new FormGroup({
    login: new FormControl('', { asyncValidators: this.userValidationService.login }),
    password: new FormControl('', { asyncValidators: this.userValidationService.passwordCreate }),
  });
  loading = signal(false);

  async signUp(login: string, password: string) {
    this.loading.set(true);

    try {
      await this.authService.signUp(login, password);

      this.router.navigate(ROUTES_NAVIGATION.DASHBOARD, { replaceUrl: true });
    } catch (error) {
      const errorResponse = await this.authValidationService.errorResponse(error);
      if (errorResponse?.status === ERROR_STATUS_CODES.CONFLICT) {
        this.signUpData.controls.login.setErrors({ conflict: errorResponse.error.message });
      }
    }

    this.loading.set(false);
  }

  onSubmit() {
    this.signUp(this.signUpData.value.login!, this.signUpData.value.password!);
  }
}
