import { ElementRef, Injectable } from '@angular/core';

import { Nullable } from '@curseit/types';

import { CiuiContextMenu } from './context-menu';

export type ContextMenuWrapper = {
  id: string | ElementRef['nativeElement'];
  menu: CiuiContextMenu;
};

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  menus: Array<ContextMenuWrapper> = [];

  registerMenu(menu: CiuiContextMenu, element: ElementRef, menuId?: string) {
    this.menus.push({ id: menuId ?? element.nativeElement, menu });
  }

  unregisterMenu(menu: CiuiContextMenu) {
    this.menus = this.menus.filter(wrapper => wrapper.menu !== menu);
  }

  getMenu(locator: ElementRef['nativeElement'] | string): Nullable<CiuiContextMenu> {
    return this.menus.find(({ id }) => id === locator)?.menu ?? null;
  }

  toggleMenu(
    locator: CiuiContextMenu | ElementRef['nativeElement'] | string,
    value?: boolean,
  ): void {
    const menu = locator instanceof CiuiContextMenu ? locator : this.getMenu(locator);
    if (!menu) {
      return;
    }

    value = value ?? !menu.isOpened();
    if (!value) {
      this.menus
        .filter(wrapper => wrapper.menu !== menu)
        .forEach(({ menu }) => menu.toggle(false));
    }

    menu.toggle(value);
  }
}
