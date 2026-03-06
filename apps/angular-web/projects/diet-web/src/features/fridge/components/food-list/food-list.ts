import {
  Component,
  HostBinding,
  ViewEncapsulation,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Subscription } from 'rxjs';

import { CiuiDialog } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { NavigationService } from '@/core/router/navigation.service';
import { RouterService } from '@/core/router/router.service';
import { ROUTES } from '@/core/router/routes';

import { FridgeService } from '../../fridge.service';
import { FoodStore } from '../../store/food.store';
import { FoodsStore } from '../../store/foods.store';
import { CidFoodCreateNew } from '../food-create-new/food-create-new';
import { CidFoodListItem } from '../food-list-item/food-list-item';

@Component({
  selector: 'cid-food-list',
  imports: [RouterOutlet, RouterLink, CiuiDialog, CidFoodCreateNew, CidFoodListItem],
  templateUrl: './food-list.html',
  styleUrl: './food-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodList {
  fridgeService = inject(FridgeService);
  foodsStore = inject(FoodsStore);
  foodStore = inject(FoodStore);
  routerService = inject(RouterService);
  navigationService = inject(NavigationService);
  dialogRef = viewChild.required(CiuiDialog);

  constructor() {
    this.fridgeService.loadFoods();

    effect(() => {
      const leafId_ = this.routerService.leafId();

      untracked(() => {
        this.handleDialog(leafId_);
      });
    });
  }

  ngAfterViewInit() {
    this.handleDialog(this.routerService.leafId());
  }

  ngOnDestroy() {
    this._leafSubscription?.unsubscribe();
  }

  getFoodNavigation(foodId: string) {
    return this.navigationService.getParametrizedNavigation(ROUTES.FRIDGE.FOODS.FOOD.ROOT)(foodId);
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

    this.navigationService.goTo(ROUTES.FRIDGE.FOODS.FOOD.ROOT, foodId);
  }

  handleDialog(leafId: Nullable<symbol>) {
    if (
      leafId &&
      Object.values(ROUTES.FRIDGE.FOODS.FOOD)
        .map(({ id }) => id)
        .includes(leafId) &&
      !this.dialogRef().isOpened()
    ) {
      this._dialog().toggle(true, { modal: false });
    } else if (leafId === ROUTES.FRIDGE.FOODS.ROOT.id && this.dialogRef().isOpened()) {
      this._dialog().toggle(false, { modal: false });
    }
  }

  @HostBinding('class')
  hostClass = 'cid-food-list';

  private _leafSubscription: Nullable<Subscription> = null;
  private _dialog = viewChild.required<CiuiDialog>('dialog');
}
