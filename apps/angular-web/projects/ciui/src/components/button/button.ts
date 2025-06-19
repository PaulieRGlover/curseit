import { booleanAttribute, Component, HostBinding, Input } from '@angular/core';

export type BUTTON_THEMES = 'primary' | 'secondary';
export type BUTTON_SIZES = 'default' | 'small';

@Component({
  selector: '[ciui-button]',
  templateUrl: './button.html',
})
export class CiuiButton {
  @HostBinding('class.ciui-button--disabled')
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() theme: BUTTON_THEMES = 'primary';
  @Input() size: BUTTON_SIZES = 'default';

  @HostBinding('class')
  get hostClasses() {
    return `
      ciui-button
      ciui-button--theme-${this.theme}
      ciui-button--size-${this.size}
    `;
  }
}
