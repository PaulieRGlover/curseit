import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CiuiForm, CiuiInput } from '@curseit/ciui';

import { ERROR_STATUS_CODES } from '@/shared/constants/api.constants';
import { NavigationService } from '@/core/router/navigation.service';
import { ROUTES } from '@/core/router/routes';
import { AuthInternalValidationService } from '@/features/auth/validation/auth-internal-validation.service';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'cid-sign-in',
  imports: [ReactiveFormsModule, RouterLink, CiuiForm, CiuiInput],
  templateUrl: './sign-in.html',
})
export class CidSignIn {
  private navigationService = inject(NavigationService);
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
      await this.navigationService.replaceWith(ROUTES.DASHBOARD);
    } else if (failure?.status === ERROR_STATUS_CODES.UNAUTHORIZED) {
      this.signInData.setErrors(failure.error.message.map(({ description }) => description));
    }

    this.loading.set(false);
  }

  onSubmit() {
    this.signIn(this.signInData.value.login!, this.signInData.value.password!);
  }
}
