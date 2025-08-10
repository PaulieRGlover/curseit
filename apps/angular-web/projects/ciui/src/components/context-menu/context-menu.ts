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
import { CiuiContextMenuDirective } from './context-menu.directive';

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
      this.element.nativeElement.showPopover();
    } else {
      this.element.nativeElement.hidePopover();
    }
  }

  public bind(triggerElement: ElementRef, directive: CiuiContextMenuDirective) {
    this._triggerElement.set(triggerElement);
    this._directive.set(directive);
    this.setPosition();
    this._resizeObserver.observe(triggerElement.nativeElement);
  }

  ngOnInit() {
    this.contextMenuService.registerMenu(this, this.element, this.menuId());
  }

  ngOnDestroy() {
    this.contextMenuService.unregisterMenu(this);
  }

  @HostBinding('class')
  get hostClasses() {
    return [
      'ciui-card',
      `ciui-card--theme-${this.theme()}`,
      `ciui-card--size-${this.size()}`,
      this.symmetric() ? `ciui-card--symmetric` : '',
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

    const rect = (trigger as HTMLElement).getBoundingClientRect();
    this.dimensions.set({
      width: rect.width,
      top: rect.top + rect.height,
      left: rect.left,
    });
  }

  private _triggerElement = signal<Nullable<ElementRef>>(null);
  private _directive = signal<Nullable<CiuiContextMenuDirective>>(null);
  private _resizeObserver = new ResizeObserver(() => this.setPosition());
}
