import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cid-food-portions',
  templateUrl: './food-portions.html',
  styleUrl: './food-portions.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodPortions {
  @HostBinding('class')
  hostClass = 'cid-food-portions';
}
