import { Component, HostBinding, ViewEncapsulation, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Size } from '../../shared/constants/sizes';

export type Icon = 'info' | 'close' | 'add' | 'star';
const SvgMap: Record<Icon, string | (() => Promise<{ default: string }>)> = {
  info: () => import('./svg/info.svg'),
  close: () => import('./svg/close.svg'),
  add: () => import('./svg/add.svg'),
  star: '⭐',
};

@Component({
  selector: 'ciui-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiIcon {
  private sanitizer = inject(DomSanitizer);

  name = input.required<Icon>();

  size = input<Size>('medium');

  svg = signal<SafeHtml>('');

  async ngOnInit() {
    const entry = SvgMap[this.name()];
    const svg = typeof entry === 'string' ? entry : (await entry()).default;
    this.svg.set(this.sanitizer.bypassSecurityTrustHtml(svg));
  }

  @HostBinding('class')
  get hostClasses() {
    return ['ciui-icon', `ciui-icon--size-${this.size()}`];
  }
}
