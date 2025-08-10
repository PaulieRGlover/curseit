import { Component, HostBinding, input, ViewEncapsulation } from '@angular/core';

import { CidBasicInformation } from './basic-information/basic-information';
import { CidVariations } from './variations/variations';

@Component({
  selector: 'cid-food-full',
  imports: [CidBasicInformation, CidVariations],
  templateUrl: './food-full.html',
  styleUrl: './food-full.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodFull {
  food = input<any>();

  @HostBinding('class')
  hostClass = 'ciui-food-full';
}
