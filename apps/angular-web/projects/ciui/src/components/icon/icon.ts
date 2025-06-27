import { Component, inject, Input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type CiuiIcons =
  'info' |
  'star';
const SvgMap: Record<CiuiIcons, string | (() => Promise<{ default: string }>)> = {
  info: () => import('./svg/info.svg'),
  star: '⭐',
};

@Component({
  selector: 'ciui-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class CiuiIcon {
  private sanitizer = inject(DomSanitizer);

  @Input({ required: true }) name!: CiuiIcons;

  svg = signal<SafeHtml>('');

  async ngOnInit() {
    const entry = SvgMap[this.name];
    const svg = typeof entry === 'string' ? entry : (await entry()).default;
    this.svg.set(this.sanitizer.bypassSecurityTrustHtml(svg));
  }
}
