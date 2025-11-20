import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  HostBinding,
  TemplateRef,
  booleanAttribute,
  contentChild,
  input,
} from '@angular/core';

import { Size, Theme } from '../../shared/constants';

@Component({
  selector: 'ciui-card, [ciui-card]',
  imports: [NgTemplateOutlet],
  templateUrl: './card.html',
})
export class CiuiCard {
  theme = input<Theme>('white');
  size = input<Size>('medium');
  noShadow = input<boolean, any>(false, { transform: booleanAttribute });
  symmetric = input<boolean, any>(false, { transform: booleanAttribute });

  readonly tabsTemplate = contentChild('tabs', { read: TemplateRef });

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
