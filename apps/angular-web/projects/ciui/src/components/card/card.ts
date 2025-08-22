import { booleanAttribute, Component, HostBinding, input } from '@angular/core';

import { Size, Theme } from '../../shared/constants';

@Component({
  selector: 'ciui-card, [ciui-card]',
  templateUrl: './card.html',
})
export class CiuiCard {
  theme = input<Theme>('white');
  size = input<Size>('medium');
  noShadow = input<boolean, any>(false, { transform: booleanAttribute });
  symmetric = input<boolean, any>(false, { transform: booleanAttribute });

  @HostBinding('class')
  get hostClasses() {
    return [
      'ciui-card',
      `ciui-card--theme-${this.theme()}`,
      `ciui-card--size-${this.size()}`,
      this.noShadow() ? 'ciui-card--no-shadow' : '',
      this.symmetric() ? 'ciui-card--symmetric' : '',
    ];
  }
}
