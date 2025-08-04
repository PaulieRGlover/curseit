import { Component, Input, ViewEncapsulation, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SIZES } from '../../shared/constants/sizes';

export type CIUI_ICONS = 'info' | 'close' | 'star';
const SvgMap: Record<CIUI_ICONS, string | (() => Promise<{ default: string }>)> = {
  info: () => import('./svg/info.svg'),
  close: () => import('./svg/close.svg'),
  star: '⭐',
};

@Component({
  selector: 'ciui-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  host: {
    class: 'ciui-icon',
    '[class.ciui-icon--size-small]': 'size === "small"',
    '[class.ciui-icon--size-default]': 'size === "default"',
  },
  encapsulation: ViewEncapsulation.None,
})
export class CiuiIcon {
  private sanitizer = inject(DomSanitizer);

  @Input({ required: true }) name!: CIUI_ICONS;
  @Input() size: SIZES = 'default';

  svg = signal<SafeHtml>('');

  async ngOnInit() {
    const entry = SvgMap[this.name];
    const svg = typeof entry === 'string' ? entry : (await entry()).default;
    this.svg.set(this.sanitizer.bypassSecurityTrustHtml(svg));
  }
}
