import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { Nullable } from '@curseit/types';

import { CONTEXT_MENU_ERRORS, Size, Theme } from '../../shared/constants';
import { cardClasses } from '../card/card.utils';
import { CiuiIcon } from '../icon/icon';

import { CiuiContextMenuService, ContextMenuWrapper } from './context-menu.service';

@Component({
  selector: 'ciui-context-menu',
  templateUrl: './context-menu.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CiuiIcon],
})
export class CiuiContextMenu {
  element = inject(ElementRef);
  contextMenuService = inject(CiuiContextMenuService);

  menuId = input<string>();

  menuTitle = input<string>();
  closable = input<boolean, any>(false, { transform: booleanAttribute });
  theme = input<Theme>('white');
  size = input<Size>('medium');
  width = input<string, number | 'fit-content'>(undefined, {
    transform: (value: number | 'fit-content') => {
      return value === 'fit-content' ? value : `${value}px`;
    },
  });
  noShadow = input<boolean, any>(false, { transform: booleanAttribute });
  symmetric = input<boolean, any>(false, { transform: booleanAttribute });

  toggled = output<boolean>();

  isOpen = signal(false);
  dimensions = signal({
    width: 0,
    top: 0,
    left: 0,
  });

  toggle(state = !this.isOpen()) {
    this.isOpen.set(state);
    if (state) {
      this.setPosition();
      this.element.nativeElement.showPopover();
    } else {
      this.element.nativeElement.hidePopover();
    }

    this.toggled.emit(state);
  }

  ngAfterViewInit() {
    const menuWrapper = this.contextMenuService.pairMenu(this, this.menuId());
    this._menuWrapper.set(menuWrapper);
    this.setPosition();
  }

  ngOnDestroy() {
    this.contextMenuService.destroyMenu(this, this.menuId());
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
      !this.isOpen() ? `ciui-context-menu--closed` : '',
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

    if (this.width()) {
      style.width = this.width();
    } else {
      style.width = `${dimensions.width}px`;
    }

    return style;
  }

  @HostBinding('attr.popover')
  popoverAttribute = 'manual';

  @HostBinding('attr.data-menu-id')
  get menuIdAttribute() {
    return this.menuId();
  }

  @HostListener('mousedown')
  @HostListener('pointerdown')
  preventBlurOnce() {
    // prevent blur from closing the context menu when clicking inside it
    this._trigger.preventBlurOnce();
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleWindowEscapePress(event: Event) {
    if (this.isOpen() && this._trigger.trigger() !== 'manual') {
      this.toggle(false);
      event.preventDefault();
    }
  }

  setPosition(rect: DOMRect = this._triggerElement.getBoundingClientRect()) {
    const { width, top, height, left } = rect;
    const { scrollTop } = document.documentElement;
    this.dimensions.set({
      width,
      top: top + height + scrollTop,
      left,
    });
  }

  private _menuWrapper = signal<Nullable<ContextMenuWrapper>>(null);

  private get _trigger() {
    const trigger = this._menuWrapper()?.trigger();
    if (!trigger) {
      throw new Error(CONTEXT_MENU_ERRORS.NO_TRIGGER);
    }

    return trigger;
  }

  private get _triggerElement(): HTMLElement {
    return this._trigger.element.nativeElement;
  }
}
