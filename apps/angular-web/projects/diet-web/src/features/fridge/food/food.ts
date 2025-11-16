import { Component, HostBinding, ViewEncapsulation, input } from '@angular/core';

import { cardClasses } from '@curseit/ciui';

import { Food } from '../types/external/food.types';

@Component({
  selector: 'cid-food',
  templateUrl: './food.html',
  styleUrl: './food.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFood {
  food = input.required<Food>();
  
  @HostBinding('class')
  hostClasses = ['cid-food', ...cardClasses({ noShadow: true })];
}
