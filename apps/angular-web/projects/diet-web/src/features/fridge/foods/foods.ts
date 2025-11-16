import { Component, HostBinding, ViewEncapsulation, effect, inject, untracked, viewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Subscription } from 'rxjs';

import { CiuiDialog, DialogService } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { NavigationService } from '@/core/router/navigation.service';
import { LeafRouteSnapshot, RouterService } from '@/core/router/router.service';
import { ROUTES } from '@/core/router/routes';

import { CidFoodCreateNew } from '../food-create-new/food-create-new';
import { CidFood } from '../food/food';
import { FridgeService } from '../fridge.service';
import { FoodStore } from '../store/food.store';
import { FoodsStore } from '../store/foods.store';

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
  dialogService = inject(DialogService);
  dialogRef = viewChild.required(CiuiDialog);

  constructor() {
    this.fridgeService.loadFoods();

    effect(() => {
      const leaf = this.routerService.leaf();

      untracked(() => {
        this.handleDialog(leaf);
      });
    });
  }

  ngAfterViewInit() {
    this.handleDialog(this.routerService.leaf());
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

  handleDialogToggled(state: boolean) {
    if (!state) {
      this.goToFoods();
    }
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
    if (leaf?.params?.['foodId'] && !this.dialogRef().isOpened()) {
      this.dialogService.toggleDialog(this.dialogRef(), true);
    } else if (!leaf?.params?.['foodId'] && this.dialogRef().isOpened()) {
      this.dialogService.toggleDialog(this.dialogRef(), false);
    }
  }

  @HostBinding('class')
  hostClass = 'cid-foods';

  private _leafSubscription: Nullable<Subscription> = null;
}
