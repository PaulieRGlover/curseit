import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { CiuiButton, CiuiInput } from '@curseit/ciui';

import { AuthValidationService } from '@/core/validation/external/auth/auth-validation.service';
import { UserValidationService } from '@/core/validation/internal/user/user-validation.service';

import { AuthService } from '../auth.service';
import { ErrorStatusCodes } from '@/core/dtos/external/status-codes';

@Component({
  selector: 'cid-sign-up',
  imports: [ReactiveFormsModule, RouterLink, CiuiInput, CiuiButton],
  templateUrl: './sign-up.html',
  styleUrls: ['../auth.scss'],
})
export class SignUp {
  signUpData: FormGroup<{
    login: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  constructor(
    private authService: AuthService,
    private authValidationService: AuthValidationService,
    userValidationService: UserValidationService,
  ) {
    this.signUpData = new FormGroup({
      login: new FormControl('', userValidationService.login),
      password: new FormControl('', userValidationService.password),
    });
  }

  async signUp(login: string, password: string) {
    try {
      await this.authService.signUp(login, password);
    } catch (error) {
      const errorResponse = this.authValidationService.errorResponse(error);
      if (errorResponse?.status === ErrorStatusCodes.CONFLICT) {
        this.signUpData.controls.login.setErrors({ conflict: errorResponse.error.message });
      }
    }
  }

  onSubmit() {
    if (this.signUpData.valid) {
      this.signUp(this.signUpData.value.login!, this.signUpData.value.password!);
    }
  }
}
