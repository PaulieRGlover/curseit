import { Component, Input } from '@angular/core';

import { CidBasicInformation } from './basic-information/basic-information';
import { CidVariations } from './variations/variations';
import { MaybeUndefined } from '@curseit/types';

@Component({
  selector: 'cid-food-full',
  imports: [CidBasicInformation, CidVariations],
  templateUrl: './food-full.html',
  styleUrl: './food-full.scss',
  host: {
    class: 'ciui-card',
  },
})
export class CidFoodFull {
  @Input() food: MaybeUndefined<any>;
}
