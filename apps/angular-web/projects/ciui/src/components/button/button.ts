import {
  Component,
  HostBinding,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

import { Nullable } from '@curseit/types';

import { downscaleSize, invertTheme, Size, Theme } from '../../shared/constants';
import { CiuiIcon, Icon } from '../icon/icon';
import { CiuiLoader } from '../loader/loader';

export type ButtonTheme = 'primary' | 'secondary';

@Component({
  selector: '[ciui-button]',
  imports: [CiuiIcon, CiuiLoader],
  templateUrl: './button.html',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiButton {
  disabledSource = input<boolean, any>(false, { alias: 'disabled', transform: booleanAttribute });
  loading = input<boolean, any>(false, { transform: booleanAttribute });
  error = input<boolean, any>(false, { transform: booleanAttribute });
  theme = input<Theme>('white');
  buttonTheme = input<ButtonTheme>('primary');
  size = input<Size>('medium');
  icon = input<Nullable<Icon>>(null);
  iconSize = input<Size>('medium');
  noDisableOnLoading = input<boolean, any>(false, { transform: booleanAttribute });

  invertedTheme = computed(() => {
    return invertTheme(this.theme());
  });

  downscaledSize = computed(() => {
    return downscaleSize(this.size());
  });

  disabled = computed(() => {
    return this.noDisableOnLoading()
      ? this.disabledSource()
      : this.disabledSource() || this.loading();
  });

  @HostBinding('class')
  get hostClasses() {
    return `
      ciui-button
      ${this.disabledSource() ? 'ciui-button--disabled' : ''}
      ${this.loading() ? 'ciui-button--loading' : ''}
      ${this.error() ? 'ciui-button--error' : ''}
      ${this.icon() ? 'ciui-button--icon' : ''}
      ciui-button--button-theme-${this.buttonTheme()}
      ciui-button--size-${this.size()}
    `;
  }

  @HostBinding('attr.disabled')
  get disabledAttribute() {
    return this.disabled() ? '' : null;
  }

  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
