import { Component, HostBinding, input } from '@angular/core';

import { Size, Theme } from '../../shared/constants';

@Component({
  selector: 'ciui-card',
  templateUrl: './card.html',
})
export class CiuiCard {
  theme = input<Theme>('white');
  size = input<Size>('medium');

  @HostBinding('class')
  get hostClasses() {
    return [
      'ciui-card',
      `ciui-card--theme-${this.theme()}`,
      `ciui-card--size-${this.size()}`
    ];
  }
}
