import { Component, HostBinding, ViewEncapsulation, computed, inject } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';

import { CiuiButton, cardClasses } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { NavigationService } from '@/core/router/navigation.service';
import { RouterService } from '@/core/router/router.service';
import { ROUTES, RouteId } from '@/core/router/routes';

import { FridgeService } from '../../fridge.service';

const { ROOT: FOODS_ROUTE, FOOD: FOOD_ROUTE } = ROUTES.FRIDGE.FOODS;

@Component({
  selector: 'cid-food',
  imports: [RouterOutlet, RouterLinkWithHref, CiuiButton],
  templateUrl: './food.html',
  styleUrl: './food.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFood {
  routerService = inject(RouterService);
  navigationService = inject(NavigationService);
  fridgeService = inject(FridgeService);

  foodId = computed<Nullable<string>>(() => {
    return this.routerService.findInTreeById(FOOD_ROUTE.ROOT.id)?.params?.['foodId'] ?? null;
  });

  isInfoActive = computed(() => this.routerService.leafId() === FOOD_ROUTE.INFO.id);

  isPortionsActive = computed(() => this.routerService.leafId() === FOOD_ROUTE.PORTIONS.id);

  getInfoNavigation = computed(() => this._getFoodNavigation(FOOD_ROUTE.INFO));

  getPortionsNavigation = computed(() => this._getFoodNavigation(FOOD_ROUTE.PORTIONS));

  ngOnDestroy() {
    this.fridgeService.resetFood();
  }

  handleFavorite() {}

  handleRemove() {
    this.fridgeService.removeFood();
    this.navigationService.goTo(FOODS_ROUTE);
  }

  @HostBinding('class')
  hostClasses = ['cid-food', ...cardClasses()];

  private _getFoodNavigation(route: RouteId) {
    const foodId_ = this.foodId();
    if (!foodId_) {
      return null;
    }

    return this.navigationService.getParametrizedNavigation(route)(foodId_);
  }
}
