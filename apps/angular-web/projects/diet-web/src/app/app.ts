import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { RouterService } from '@/core/router/router.service';
import { CidProfileDropdown } from '@/features';
import { AuthFlowService } from '@/features/auth/auth-flow.service';

import { CidGuest, CidHome } from './layouts';

@Component({
  selector: 'app-root',
  imports: [CommonModule, CidGuest, CidHome, CidProfileDropdown, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class CidApp {
  private routerService = inject(RouterService);
  private authFlowService = inject(AuthFlowService);

  layout = computed(() => this.routerService.base()?.data['layout']);

  ngOnInit() {
    this.authFlowService.initialize();
  }
}
