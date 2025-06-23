import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CiuiForm, CiuiInput } from '@curseit/ciui';

import { ROUTES_NAVIGATION } from '@/core/constants/router.constants';
import { ErrorStatusCodes } from '@/core/dtos/external/status-codes.dto';
import { AuthValidationService } from '@/core/validation/external/auth/auth-validation.service';
import { UserValidationService } from '@/core/validation/internal/user/user-validation.service';

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
  private authValidationService = inject(AuthValidationService);
  private userValidationService = inject(UserValidationService);

  signInData = new FormGroup({
    login: new FormControl('', this.userValidationService.login),
    password: new FormControl('', this.userValidationService.password),
  });
  loading = false;

  async signIn(login: string, password: string) {
    this.loading = true;

    try {
      await this.authService.signIn(login, password);

      this.router.navigate(ROUTES_NAVIGATION.DASHBOARD, { replaceUrl: true });
    } catch (error) {
      const errorResponse = this.authValidationService.errorResponse(error);
      if (errorResponse?.status === ErrorStatusCodes.UNAUTHORIZED) {
        this.signInData.setErrors({ unauthorized: errorResponse.error.message });
      }
    }

    this.loading = false;
  }

  onSubmit() {
    this.signIn(this.signInData.value.login!, this.signInData.value.password!);
  }
}
