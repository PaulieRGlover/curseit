import { Component, HostBinding, ViewEncapsulation, input } from '@angular/core';

import { Size, Theme } from '../../shared/constants';

@Component({
  selector: 'ciui-loader',
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiLoader {
  size = input<Size>('medium');
  theme = input<Theme>('white');

  @HostBinding('class')
  get hostClasses() {
    return [
      'ciui-loader',
      `ciui-loader--size-${this.size()}`,
      `ciui-loader--theme-${this.theme()}`,
    ];
  }
}
