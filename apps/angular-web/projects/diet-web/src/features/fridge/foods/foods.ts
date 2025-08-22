import { Component, HostBinding, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Subscription } from 'rxjs';

import { CiuiDialog } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { NavigationService } from '@/core/router/navigation.service';
import { LeafRouteSnapshot, RouterService } from '@/core/router/router.service';
import { ROUTES } from '@/core/router/routes';

import { CidFoodCreateNew } from '../food-create-new/food-create-new';
import { CidFood } from '../food/food';
import { FoodStore } from '../store/food.store';
import { FoodsStore } from '../store/foods.store';
import { FridgeService } from '../fridge.service';

@Component({
  selector: 'cid-foods',
  imports: [RouterOutlet, RouterLink, CidFood, CidFoodCreateNew, CiuiDialog],
  templateUrl: './foods.html',
  styleUrl: './foods.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoods {
  fridgeService = inject(FridgeService);
  foodsStore = inject(FoodsStore);
  foodStore = inject(FoodStore);
  routerService = inject(RouterService);
  navigationService = inject(NavigationService);
  dialog = viewChild.required(CiuiDialog);

  constructor() {
    this.fridgeService.loadFoods();
  }

  ngAfterViewInit() {
    this._leafSubscription = this.routerService.leaf$.subscribe(this.handleDialog.bind(this));
  }

  ngOnDestroy() {
    this._leafSubscription?.unsubscribe();
  }

  getFoodNavigation(foodId: string) {
    return this.navigationService.getParametrizedNavigation(ROUTES.FRIDGE.FOODS.FOOD)(foodId);
  }

  goToFoods() {
    this.navigationService.goTo(ROUTES.FRIDGE.FOODS.ROOT);
  }

  async handleNewFoodClick() {
    await this.fridgeService.createFood();
    const foodId = this.foodStore.food()?.id;
    if (!foodId) {
      return;
    }

    this.navigationService.goTo(ROUTES.FRIDGE.FOODS.FOOD, foodId);
  }

  handleDialog(leaf: Nullable<LeafRouteSnapshot>) {
    if (leaf?.params?.['foodId'] && !this.dialog().isOpened()) {
      this.dialog().toggle(true);
    } else {
      this.dialog().toggle(false);
    }
  }

  @HostBinding('class')
  hostClass = 'cid-foods';

  private _leafSubscription: Nullable<Subscription> = null;
}
