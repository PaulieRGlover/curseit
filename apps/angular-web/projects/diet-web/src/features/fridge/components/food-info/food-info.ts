import { Component, HostBinding, ViewEncapsulation, computed, inject } from '@angular/core';

import { CiuiLoader } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { RouterService } from '@/core/router/router.service';

import { FridgeService } from '../../fridge.service';
import { FoodStore } from '../../store/food.store';
import { CidFoodBasicInfo } from '../food-basic-info/food-basic-info';
import { CidVariations } from '../variations/variations';

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
    const foodId_ = this.foodId();
    const food_ = this.foodStore.food();
    if (
      foodId_ && 
      (!food_ || food_.id !== foodId_)
    ) {
      this.fridgeService.loadFood(foodId_);
    }
  }

  @HostBinding('class')
  hostClass = 'cid-food-info';
}
