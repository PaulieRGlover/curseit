import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  signal,
} from '@angular/core';

import { Nullable } from '@curseit/types';

import { Size, Theme } from '../../shared/constants';

import { ContextMenuService } from './context-menu.service';
import { CiuiContextMenuTriggerDirective } from './context-menu.directive';
import { cardClasses } from '../card/card.utils';

@Component({
  selector: 'ciui-context-menu',
  templateUrl: './context-menu.html',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiContextMenu {
  element = inject(ElementRef);
  contextMenuService = inject(ContextMenuService);

  menuId = input<string>();
  theme = input<Theme>('white');
  size = input<Size>('medium');
  width = input<number>();
  noShadow = input<boolean, any>(false, { transform: booleanAttribute });
  symmetric = input<boolean, any>(false, { transform: booleanAttribute });

  isOpened = signal(false);
  dimensions = signal({
    width: 0,
    top: 0,
    left: 0,
  });

  public toggle(state = !this.isOpened) {
    this.isOpened.set(state);
    if (state) {
      this.setPosition();
      this.element.nativeElement.showPopover();
    } else {
      this.element.nativeElement.hidePopover();
    }
  }

  public bind(triggerElement: ElementRef, directive: CiuiContextMenuTriggerDirective) {
    this._triggerElement.set(triggerElement);
    this._directive.set(directive);
    this.setPosition();
    this._resizeObserver.observe(triggerElement.nativeElement);
  }

  ngOnInit() {
    this.contextMenuService.registerMenu(this, this.element, this.menuId());
  }

  ngOnDestroy() {
    this._resizeObserver.unobserve(this._triggerElement()?.nativeElement);
    this.contextMenuService.unregisterMenu(this);
  }

  @HostBinding('class')
  get hostClasses() {
    return [
      ...cardClasses({
        theme: this.theme(),
        size: this.size(),
        symmetric: this.symmetric(),
        noShadow: this.noShadow(),
        noBorder: true,
      }),
      'ciui-context-menu',
      !this.isOpened() ? `ciui-context-menu--closed` : '',
      `ciui-context-menu--theme-${this.theme()}`,
      `ciui-context-menu--size-${this.size()}`,
    ];
  }

  @HostBinding('style')
  get hostStyles() {
    const dimensions = this.dimensions();
    const style: Partial<CSSStyleDeclaration> = {
      top: `${dimensions.top}px`,
      left: `${dimensions.left}px`,
    };

    if (typeof this.width() === 'number') {
      style.minWidth = `${dimensions.width}px`;
      style.width = `${this.width()}px`;
    } else {
      style.width = `${dimensions.width}px`;
    }

    return style;
  }

  @HostBinding('attr.popover')
  popoverAttribute = 'manual';

  @HostListener('mousedown')
  @HostListener('pointerdown')
  preventBlurOnce() {
    // prevent blur from closing the context menu when clicking inside it
    this._directive()?.preventBlurOnce();
  }

  private setPosition() {
    const trigger = this._triggerElement()?.nativeElement;
    if (!trigger) {
      return;
    }

    const { width, top, height, left } = (trigger as HTMLElement).getBoundingClientRect();
    const { scrollTop } = document.documentElement;
    this.dimensions.set({
      width,
      top: top + height + scrollTop,
      left,
    });
  }

  private _triggerElement = signal<Nullable<ElementRef>>(null);
  private _directive = signal<Nullable<CiuiContextMenuTriggerDirective>>(null);
  private _resizeObserver = new ResizeObserver(() => this.setPosition());
}
