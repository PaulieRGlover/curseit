import {
  Component,
  HostBinding,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Size } from '../../shared/constants/sizes';

export type Icon =
  | 'info'
  | 'close'
  | 'add'
  | 'chevron-down'
  | 'chevron-up'
  | 'menu-down'
  | 'menu-up'
  | 'question'
  | 'cancel'
  | 'check-mark'
  | 'save'
  | 'edit'
  | 'delete'
  | 'star'
  | 'plus'
  | 'cook'
  | 'eat'
  | 'trashcan'
  | 'copy';
const SvgMap: Record<Icon, string | (() => Promise<{ default: string }>)> = {
  info: () => import('./svg/info.svg'),
  close: () => import('./svg/close.svg'),
  add: () => import('./svg/add.svg'),
  ['chevron-down']: () => import('./svg/chevron-down.svg'),
  ['chevron-up']: () => import('./svg/chevron-up.svg'),
  ['menu-down']: () => import('./svg/menu-down.svg'),
  ['menu-up']: () => import('./svg/menu-up.svg'),
  question: () => import('./svg/question.svg'),
  cancel: () => import('./svg/cancel.svg'),
  ['check-mark']: () => import('./svg/check-mark.svg'),
  save: () => import('./svg/save.svg'),
  edit: () => import('./svg/edit.svg'),
  delete: () => import('./svg/delete.svg'),
  star: '⭐',
  plus: '➕',
  cook: '🍳',
  eat: '🍽️',
  trashcan: '🗑️',
  copy: '👯‍♀️',
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
  disabled = input<boolean, any>(false, { transform: booleanAttribute });

  svg = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      const name = this.name();

      untracked(() => {
        this.setSvg(name);
      });
    });
  }

  async ngOnInit() {
    this.setSvg(this.name());
  }

  @HostBinding('class')
  get hostClasses() {
    return [
      'ciui-icon',
      this.disabled() ? 'ciui-icon--disabled' : '',
      `ciui-icon--size-${this.size()}`,
    ];
  }

  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private async setSvg(name: Icon) {
    const entry = SvgMap[name];
    const svg = typeof entry === 'string' ? entry : (await entry()).default;
    this.svg.set(this.sanitizer.bypassSecurityTrustHtml(svg));
  }
}
