import { Component, HostBinding, ViewEncapsulation, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CiuiLoader, cardClasses } from '@curseit/ciui';
import { MaybeUndefined } from '@curseit/types';

import { ERROR_STATUS_CODES } from '@/core/constants/api.constants';
import { RouterService } from '@/core/router/router.service';

import { Food } from '../types/external/food.types';

import { CidBasicInformation } from './basic-information/basic-information';
import { CidVariations } from './variations/variations';
import { FoodStore } from '../store/food.store';
import { FridgeService } from '../fridge.service';

type BasicInformation = Pick<Food, 'name' | 'description' | 'perishable'>;

@Component({
  selector: 'cid-food-full',
  imports: [ReactiveFormsModule, CidBasicInformation, CidVariations, CiuiLoader],
  templateUrl: './food-full.html',
  styleUrl: './food-full.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodFull {
  routerService = inject(RouterService);
  fridgeService = inject(FridgeService);
  foodStore = inject(FoodStore);

  foodId = computed<MaybeUndefined<string>>(() => this.routerService.leaf()?.params?.['foodId']);
  notFound = computed(() => this.foodStore.failure()?.status === ERROR_STATUS_CODES.NOT_FOUND);

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
  hostClasses = ['ciui-food-full', ...cardClasses()];
}
