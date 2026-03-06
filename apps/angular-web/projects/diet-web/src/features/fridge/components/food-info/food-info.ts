import {
  Component,
  HostBinding,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';

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
  foodStore = inject(FoodStore);

  @HostBinding('class')
  hostClass = 'cid-food-info';
}
