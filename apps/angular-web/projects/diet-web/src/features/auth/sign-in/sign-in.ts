import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CiuiForm, CiuiInput } from '@curseit/ciui';

import { ERROR_STATUS_CODES } from '@/core/constants/api.constants';
import { ROUTES_NAVIGATION } from '@/core/constants/router.constants';
import { AuthInternalValidationService } from '@/features/auth/validation/auth-internal-validation.service';

import { AuthService } from '../auth.service';

@Component({
  selector: 'cid-sign-in',
  imports: [ReactiveFormsModule, RouterLink, CiuiForm, CiuiInput],
  templateUrl: './sign-in.html',
  styleUrls: ['../auth.scss'],
})
export class SignIn {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authInternalValidationService = inject(AuthInternalValidationService);

  signInData = new FormGroup({
    login: new FormControl('', { asyncValidators: this.authInternalValidationService.login }),
    password: new FormControl('', { asyncValidators: this.authInternalValidationService.password }),
  });
  loading = signal(false);

  async signIn(login: string, password: string) {
    this.loading.set(true);

    const { failure } = await this.authService.signIn(login, password);

    if (!failure) {
      await this.router.navigate(ROUTES_NAVIGATION.DASHBOARD, { replaceUrl: true });
    } else if (failure?.status === ERROR_STATUS_CODES.UNAUTHORIZED) {
      this.signInData.setErrors({ unauthorized: failure.error.message });
    }

    this.loading.set(false);
  }

  onSubmit() {
    this.signIn(this.signInData.value.login!, this.signInData.value.password!);
  }
}
