import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CiuiForm, CiuiInput } from '@curseit/ciui';

import { ERROR_STATUS_CODES } from '@/core/constants/api.constants';
import { ROUTES_NAVIGATION } from '@/core/constants/router.constants';
import {
  AuthInternalValidationService,
} from '@/features/auth/validation/auth-internal-validation.service';

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
  private authInternalValidationService = inject(AuthInternalValidationService);

  signUpData = new FormGroup({
    login: new FormControl('', {
      asyncValidators: this.authInternalValidationService.login,
    }),
    password: new FormControl('', {
      asyncValidators: this.authInternalValidationService.passwordCreate,
    }),
  });
  loading = signal(false);

  async signUp(login: string, password: string) {
    this.loading.set(true);

    const { failure } = await this.authService.signUp(login, password);

    if (!failure) {
      await this.router.navigate(ROUTES_NAVIGATION.DASHBOARD, { replaceUrl: true });
    } else if (failure.status === ERROR_STATUS_CODES.CONFLICT) {
      this.signUpData.controls.login.setErrors({ conflict: failure.error.message });
    }

    this.loading.set(false);
  }

  onSubmit() {
    this.signUp(this.signUpData.value.login!, this.signUpData.value.password!);
  }
}
