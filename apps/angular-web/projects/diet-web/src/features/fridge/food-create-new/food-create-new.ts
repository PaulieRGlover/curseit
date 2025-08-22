import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

import { CiuiIcon, cardClasses } from '@curseit/ciui';

@Component({
  selector: 'cid-food-create-new',
  imports: [CiuiIcon],
  templateUrl: './food-create-new.html',
  styleUrl: './food-create-new.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodCreateNew {
  @HostBinding('class')
  hostClasses = ['cid-food-create-new', ...cardClasses({ noShadow: true, noBorder: true })];
}
