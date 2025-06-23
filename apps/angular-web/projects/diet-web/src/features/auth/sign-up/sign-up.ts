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
    login: new FormControl('', this.userValidationService.login),
    password: new FormControl('', this.userValidationService.passwordCreate),
  });
  loading = false;

  async signUp(login: string, password: string) {
    this.loading = true;

    try {
      await this.authService.signUp(login, password);

      this.router.navigate(ROUTES_NAVIGATION.DASHBOARD, { replaceUrl: true });
    } catch (error) {
      const errorResponse = this.authValidationService.errorResponse(error);
      if (errorResponse?.status === ErrorStatusCodes.CONFLICT) {
        this.signUpData.controls.login.setErrors({ conflict: errorResponse.error.message });
      }
    }

    this.loading = false;
  }

  onSubmit() {
    this.signUp(this.signUpData.value.login!, this.signUpData.value.password!);
  }
}
