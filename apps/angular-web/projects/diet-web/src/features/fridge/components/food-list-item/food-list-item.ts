import { Component, HostBinding, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { cardClasses } from '@curseit/ciui';

import { Food } from '../../types/external/food.types';
import { CidPortionBadge } from '../portion-badge/portion-badge';
import { FoodsStore } from '../../store/foods.store';

@Component({
  selector: 'cid-food-list-item, [cid-food-list-item]',
  imports: [CidPortionBadge],
  templateUrl: './food-list-item.html',
  styleUrl: './food-list-item.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodListItem {
  foodsStore = inject(FoodsStore);

  food = input.required<Food>();

  portions = computed(() => {
    return this.foodsStore.getPortionsByFoodId(this.food().id);
  });

  @HostBinding('class')
  hostClasses = ['cid-food-list-item', ...cardClasses({ noShadow: true })];
}
