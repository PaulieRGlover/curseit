import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AuthService } from '@/features/auth/auth.service';

@Injectable({ providedIn: 'root' })
export abstract class DietResource {
  http = inject(HttpClient);
  authService = inject(AuthService);
}
