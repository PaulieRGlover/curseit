import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { RouterService } from '@/core/router/router.service';
import { ProfileDropdown } from '@/features';
import { AuthFlowService } from '@/features/auth/auth-flow.service';

import { Guest, Home } from './layouts';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Guest, Home, ProfileDropdown, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private routerService = inject(RouterService);
  private authFlowService = inject(AuthFlowService);

  layout = computed(() => this.routerService.base()?.data['layout']);

  ngOnInit() {
    this.authFlowService.initialize();
  }
}
