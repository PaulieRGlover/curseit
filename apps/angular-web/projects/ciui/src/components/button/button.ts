import { Component, HostBinding, Input, ViewEncapsulation, booleanAttribute } from '@angular/core';

export type BUTTON_THEMES = 'primary' | 'secondary';
export type BUTTON_SIZES = 'default' | 'big' | 'small';

@Component({
  selector: '[ciui-button]',
  templateUrl: './button.html',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiButton {
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) error = false;

  @Input() theme: BUTTON_THEMES = 'primary';
  @Input() size: BUTTON_SIZES = 'default';

  @HostBinding('class')
  get hostClasses() {
    return `
      ciui-button
      ${this.disabled ? 'ciui-button--disabled' : ''}
      ${this.loading ? 'ciui-button--loading' : ''}
      ${this.error ? 'ciui-button--error' : ''}
      ciui-button--theme-${this.theme}
      ciui-button--size-${this.size}
    `;
  }
}
