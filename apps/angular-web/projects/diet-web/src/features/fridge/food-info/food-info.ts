import { Component, HostBinding, ViewEncapsulation, computed, inject } from '@angular/core';

import { CiuiLoader } from '@curseit/ciui';

import { CidFoodBasicInfo } from '../food-basic-info/food-basic-info';
import { FoodStore } from '../store/food.store';
import { CidVariations } from '../variations/variations';
import { Nullable } from '@curseit/types';
import { RouterService } from '@/core/router/router.service';
import { FridgeService } from '../fridge.service';

@Component({
  selector: 'cid-food-info',
  imports: [CidFoodBasicInfo, CidVariations, CiuiLoader],
  templateUrl: './food-info.html',
  styleUrl: './food-info.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodInfo {
  routerService = inject(RouterService);
  fridgeService = inject(FridgeService);
  foodStore = inject(FoodStore);

  foodId = computed<Nullable<string>>(() => this.routerService.leaf()?.params?.['foodId'] ?? null);

  ngOnInit() {
    const foodId = this.foodId();
    if (foodId) {
      this.fridgeService.loadFood(foodId);
    }
  }

  ngOnDestroy() {
    this.fridgeService.resetFood();
  }

  @HostBinding('class')
  hostClass = 'cid-food-info';
}
