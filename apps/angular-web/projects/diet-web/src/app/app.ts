import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterOutlet } from '@angular/router';

import { Observable, map } from 'rxjs';

import { ProfileDropdown } from '@/features';
import { AuthFlowService } from '@/features/auth/auth-flow.service';

import { Guest, Home } from './layouts';
import { RouterService } from '@/core/router/router.service';
import { Nullable } from '@curseit/types';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Guest, Home, ProfileDropdown, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  routerService = inject(RouterService);
  authFlowService = inject(AuthFlowService);

  get layout$(): Observable<string | undefined> | undefined {
    return this.routerService.base$.pipe(
      map((base: Nullable<ActivatedRouteSnapshot>) => base?.data['layout']),
    );
  }

  ngOnInit() {
    this.authFlowService.initialize();
  }
}
