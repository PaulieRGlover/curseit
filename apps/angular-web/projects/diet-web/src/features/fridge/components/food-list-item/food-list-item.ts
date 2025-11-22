import { Component, HostBinding, ViewEncapsulation, input } from '@angular/core';

import { cardClasses } from '@curseit/ciui';

import { Food } from '../../types/external/food.types';

@Component({
  selector: 'cid-food-list-item, [cid-food-list-item]',
  templateUrl: './food-list-item.html',
  styleUrl: './food-list-item.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodListItem {
  food = input.required<Food>();

  @HostBinding('class')
  hostClasses = ['cid-food-list-item', ...cardClasses({ noShadow: true })];
}
