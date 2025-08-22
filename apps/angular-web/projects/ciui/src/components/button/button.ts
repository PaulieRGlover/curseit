import { Component, HostBinding, ViewEncapsulation, booleanAttribute, input } from '@angular/core';

import { Size } from '../../shared/constants';
import { CiuiLoader } from '../loader/loader';

export type ButtonTheme = 'primary' | 'secondary';

@Component({
  selector: '[ciui-button]',
  imports: [CiuiLoader],
  templateUrl: './button.html',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiButton {
  disabled = input<boolean, any>(false, { transform: booleanAttribute });
  loading = input<boolean, any>(false, { transform: booleanAttribute });
  error = input<boolean, any>(false, { transform: booleanAttribute });
  buttonTheme = input<ButtonTheme>('primary');
  size = input<Size>('medium');

  @HostBinding('class')
  get hostClasses() {
    return `
      ciui-button
      ${this.disabled() ? 'ciui-button--disabled' : ''}
      ${this.loading() ? 'ciui-button--loading' : ''}
      ${this.error() ? 'ciui-button--error' : ''}
      ciui-button--button-theme-${this.buttonTheme()}
      ciui-button--size-${this.size()}
    `;
  }
}
