import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

import { CONTEXT_MENU_ERRORS } from '../../shared/constants';

import { ContextMenuService } from './context-menu.service';

export type Trigger = 'hover' | 'click' | 'focus';

@Directive({
  selector: '[ciuiContextMenu]',
})
export class CiuiContextMenuDirective {
  private contextMenuService = inject(ContextMenuService);

  element = inject(ElementRef);
  menuId = input<string>();
  trigger = input<Trigger>('hover');

  get locator(): ElementRef['nativeElement'] | string {
    return this.menuId() ?? (this.element.nativeElement as HTMLElement).nextElementSibling;
  }

  get menu() {
    return this.contextMenuService.getMenu(this.locator);
  }

  public preventBlurOnce() {
    this._blurPreventedOnce = true;
  }

  ngAfterViewInit() {
    if (!this.menu) {
      throw new Error(CONTEXT_MENU_ERRORS.NO_MENU);
    } else {
      this.menu.bind(this.element, this);
    }
  }

  @HostListener('mouseenter')
  onMouseenter() {
    if (this.trigger() === 'hover') {
      this.contextMenuService.toggleMenu(this.locator, true);
    }
  }

  @HostListener('mouseleave')
  onMouseleave() {
    if (this.trigger() === 'hover') {
      this.contextMenuService.toggleMenu(this.locator, false);
    }
  }

  @HostListener('click')
  onClick() {
    if (this.trigger() === 'click') {
      this.contextMenuService.toggleMenu(this.locator);
    }
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: Event['target']) {
    if (!this.menu) {
      return;
    }

    const isOpened = this.menu.isOpened();
    const isWithinContextMenu = this.menu.element.nativeElement.contains(target);
    const isWithinDirectiveCarrier = this.element.nativeElement.contains(target);
    if (
      this.trigger() === 'click' &&
      isOpened &&
      !isWithinContextMenu &&
      !isWithinDirectiveCarrier
    ) {
      this.contextMenuService.toggleMenu(this.menu, false);
    }
  }

  @HostListener('focus')
  onFocus() {
    if (this.trigger() === 'focus') {
      this.contextMenuService.toggleMenu(this.locator, true);
    }
  }

  @HostListener('blur')
  onBlur() {
    if (this.trigger() === 'focus') {
      if (this._blurPreventedOnce) {
        this._blurPreventedOnce = false;
      } else {
        this.contextMenuService.toggleMenu(this.locator, false);
      }
    }
  }

  private _blurPreventedOnce = false;
}
