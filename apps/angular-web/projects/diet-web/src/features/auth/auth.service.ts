import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  async signUp(login: string, password: string) {
    const result = await firstValueFrom(this.http.post(
      'auth/sign-up',
      { login, password },
    ));
  }
}
