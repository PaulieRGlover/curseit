import {
  Directive,
  ElementRef,
  HostListener,
  OutputRefSubscription,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';

import { Subscription, animationFrameScheduler, animationFrames, throttleTime } from 'rxjs';

import { Nullable } from '@curseit/types';

import { CONTEXT_MENU_ERRORS } from '../../shared/constants';

import { CiuiContextMenu } from './context-menu';
import { CiuiContextMenuService, ContextMenuWrapper } from './context-menu.service';

export type Trigger = 'hover' | 'click' | 'focus' | 'manual';

const THROTTLE_DELAY = 40; // ~25fps

@Directive({
  selector: '[ciui-context-menu-trigger]',
})
export class CiuiContextMenuTrigger {
  private _contextMenuService = inject(CiuiContextMenuService);
  element = inject<ElementRef<HTMLElement>>(ElementRef);

  menuId = input<string>();
  trigger = input<Trigger>('hover');

  constructor() {
    effect(onCleanUp => {
      const menu = this._menuWrapper()?.menu() ?? null;

      untracked(() => {
        this._handleGlobalSubscriptions(menu);
      });

      onCleanUp(() => this._unsubscribeGlobals());
    });
  }

  ngAfterViewInit() {
    const menuWrapper = this._contextMenuService.pairTrigger(this, this.menuId());
    this._menuWrapper.set(menuWrapper);
  }

  ngOnDestroy() {
    this._contextMenuService.destroyTrigger(this, this.menuId());
  }

  preventBlurOnce() {
    this._blurPreventedOnce = true;
  }

  @HostListener('mouseenter')
  onMouseenter() {
    if (this.trigger() === 'hover') {
      this._menu.toggle(true);
    }
  }

  @HostListener('mouseleave')
  onMouseleave() {
    if (this.trigger() === 'hover') {
      this._menu.toggle(false);
    }
  }

  @HostListener('click')
  onClick() {
    if (this.trigger() === 'click') {
      this._menu.toggle();
    }
  }

  @HostListener('focus')
  onFocus() {
    if (this.trigger() === 'focus') {
      this._menu.toggle(true);
    }
  }

  @HostListener('blur')
  onBlur() {
    if (this.trigger() !== 'focus') {
      return;
    }

    if (this._blurPreventedOnce) {
      this._blurPreventedOnce = false;
    } else {
      this._menu.toggle(false);
    }
  }

  private _onDocumentMousedown(event: Event) {
    if (this.trigger() !== 'click') {
      return;
    }

    const { target } = event;
    if (!target || !(target instanceof HTMLElement)) {
      return;
    }

    const isOpened = this._menu.isOpen();
    const isWithinContextMenu = this._menu.element.nativeElement.contains(target);
    const isWithinDirectiveCarrier = this.element.nativeElement.contains(target);
    if (
      isOpened &&
      (isWithinContextMenu || isWithinDirectiveCarrier)
    ) {
      this._clickStartedInside = true;
    }
  }

  private _onDocumentClick(event: Event) {
    if (this.trigger() !== 'click') {
      return;
    }

    const { target } = event;
    if (!target || !(target instanceof HTMLElement)) {
      return;
    }

    const clickStartedInside = this._clickStartedInside;
    this._clickStartedInside = false;

    const isOpened = this._menu.isOpen();
    const isWithinContextMenu = this._menu.element.nativeElement.contains(target);
    const isWithinDirectiveCarrier = this.element.nativeElement.contains(target);

    if (
      isOpened &&
      !isWithinContextMenu &&
      !isWithinDirectiveCarrier &&
      !clickStartedInside
    ) {
      this._menu.toggle(false);
    }
  }

  private _onRaf() {
    const rect = this.element.nativeElement.getBoundingClientRect();
    if (!this._rectCache || !this._compareRects(this._rectCache, rect)) {
      this._rectCache = rect;

      this._menu.setPosition(rect);
    }
  }

  private _handleGlobalSubscriptions(menu: Nullable<CiuiContextMenu>) {
    if (menu) {
      this._menuToggledSubscription = menu.toggled.subscribe(toggled => {
        if (toggled) {
          this._documentClickSubscription = this._contextMenuService
            .documentClicked$
            .subscribe(this._onDocumentClick.bind(this));

          this._documentMousedownSubscription = this._contextMenuService
            .documentMousedown$
            .subscribe(this._onDocumentMousedown.bind(this));

          this._rafSubscription = animationFrames()
            .pipe(throttleTime(THROTTLE_DELAY, animationFrameScheduler))
            .subscribe(this._onRaf.bind(this));
        } else {
          this._documentClickSubscription?.unsubscribe();
          this._documentMousedownSubscription?.unsubscribe();
          this._rafSubscription?.unsubscribe();
        }
      });
    } else {
      this._unsubscribeGlobals();
    }
  }

  private _unsubscribeGlobals() {
    this._menuToggledSubscription?.unsubscribe();
    this._documentClickSubscription?.unsubscribe();
    this._documentMousedownSubscription?.unsubscribe();
    this._rafSubscription?.unsubscribe();
  }

  private _compareRects(rectOne: DOMRect, rectTwo: DOMRect) {
    return (
      rectOne.left === rectTwo.left &&
      rectOne.top === rectTwo.top &&
      rectOne.width === rectTwo.width &&
      rectOne.height === rectTwo.height
    );
  }

  private _menuWrapper = signal<Nullable<ContextMenuWrapper>>(null);

  private get _menu() {
    const menu = this._menuWrapper()?.menu();
    if (!menu) {
      throw new Error(CONTEXT_MENU_ERRORS.NO_MENU);
    }

    return menu;
  }

  private _blurPreventedOnce = false;
  private _clickStartedInside = false;
  private _rafSubscription: Nullable<Subscription> = null;
  private _rectCache: Nullable<DOMRect> = null;
  private _menuToggledSubscription: Nullable<OutputRefSubscription> = null;
  private _documentClickSubscription: Nullable<Subscription> = null;
  private _documentMousedownSubscription: Nullable<Subscription> = null;
}
