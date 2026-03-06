import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@/core/router/navigation.service';
import { ROUTES } from '@/core/router/routes';
import { CidRecipeProject } from '@/features/kitchen/components/recipe-project/recipe-project';

@Component({
  selector: 'cid-home',
  imports: [RouterLink, CidRecipeProject],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class CidHome {
  navigationService = inject(NavigationService);

  getDashboardNavigation() {
    return this.navigationService.getNavigation(ROUTES.DASHBOARD);
  }

  getFridgeNavigation() {
    return this.navigationService.getNavigation(ROUTES.FRIDGE.ROOT);
  }

  getKitchenNavigation() {
    return this.navigationService.getNavigation(ROUTES.KITCHEN.ROOT);
  }
}
