import { Injectable, signal, WritableSignal } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { MaybeUndefined, Nullable } from '@curseit/types';

import { CONTEXT_MENU_ERRORS } from '../../shared/constants';

import { CiuiContextMenu } from './context-menu';
import { CiuiContextMenuTrigger } from './context-menu-trigger.directive';
import { Subject } from 'rxjs';

export type ContextMenuWrapper = {
  id: string;
  menu: WritableSignal<Nullable<CiuiContextMenu>>;
  trigger: WritableSignal<Nullable<CiuiContextMenuTrigger>>;
};

@Injectable({ providedIn: 'root' })
export class CiuiContextMenuService {
  menuWrappers: Array<ContextMenuWrapper> = [];

  private _documentClicked = new Subject<Event>();
  documentClicked$ = this._documentClicked.asObservable();

  private _documentMousedown = new Subject<Event>();
  documentMousedown$ = this._documentMousedown.asObservable();

  constructor() {
    document.addEventListener('click', event => {
      this._documentClicked.next(event);
    });

    document.addEventListener('mousedown', event => {
      this._documentMousedown.next(event);
    });
  }

  pairTrigger(trigger: CiuiContextMenuTrigger, id?: string) {
    let menuWrapper: MaybeUndefined<ContextMenuWrapper>;
    if (id) {
      menuWrapper = this._getMenuWrapperById(id);
    } else {
      menuWrapper = this._getMenuWrapperByTriggerElement(trigger);
    }

    if (menuWrapper) {
      menuWrapper.trigger.set(trigger);
    } else {
      menuWrapper = {
        id: id ?? this._randomId,
        menu: signal(null),
        trigger: signal(trigger),
      };

      this.menuWrappers.push(menuWrapper);
    }

    return menuWrapper;
  }

  pairMenu(menu: CiuiContextMenu, id?: string) {
    let menuWrapper: MaybeUndefined<ContextMenuWrapper>;
    if (id) {
      menuWrapper = this._getMenuWrapperById(id);
    } else {
      menuWrapper = this._getMenuWrapperByMenuElement(menu);
    }

    if (menuWrapper) {
      menuWrapper.menu.set(menu);
    } else {
      menuWrapper = {
        id: id ?? this._randomId,
        menu: signal(menu),
        trigger: signal(null),
      };

      this.menuWrappers.push(menuWrapper);
    }

    return menuWrapper;
  }

  destroyTrigger(trigger: CiuiContextMenuTrigger, id?: string) {
    const menuWrapper = this._getMenuWrapperByTriggerOrId(trigger, id);
    if (menuWrapper.menu()) {
      menuWrapper.trigger.set(null);
    } else {
      this._removeMenuWrapper(menuWrapper);
    }
  }

  destroyMenu(menu: CiuiContextMenu, id?: string) {
    const menuWrapper = this._getMenuWrapperByMenuOrId(menu, id);
    if (menuWrapper.trigger()) {
      menuWrapper.menu.set(null);
    } else {
      this._removeMenuWrapper(menuWrapper);
    }
  }

  private _getMenuWrapperById(id: string) {
    return this.menuWrappers.find(menuWrapper => menuWrapper.id === id);
  }

  private _getMenuWrapperByTriggerElement(trigger: CiuiContextMenuTrigger) {
    return this.menuWrappers.find(menuWrapper => {
      return (
        menuWrapper.menu()?.element.nativeElement ===
        (trigger.element.nativeElement as HTMLElement).nextElementSibling
      );
    });
  }

  private _getMenuWrapperByMenuElement(menu: CiuiContextMenu) {
    const menuWrapper = this.menuWrappers.find(menuWrapper => {
      return (
        menuWrapper.trigger()?.element.nativeElement ===
        (menu.element.nativeElement as HTMLElement).previousElementSibling
      );
    });

    if (!menuWrapper) {
      throw new Error(CONTEXT_MENU_ERRORS.NO_TRIGGER);
    }

    return menuWrapper;
  }

  private _getMenuWrapperByTriggerOrId(trigger: CiuiContextMenuTrigger, id?: string) {
    const menuWrapper = this.menuWrappers.find(menuWrapper => {
      return (
        menuWrapper.id === id ||
        menuWrapper.trigger() === trigger
      );
    });

    if (!menuWrapper) {
      throw new Error(CONTEXT_MENU_ERRORS.NO_WRAPPER_FOR_TRIGGER);
    }

    return menuWrapper;
  }

  private _getMenuWrapperByMenuOrId(menu: CiuiContextMenu, id?: string) {
    const menuWrapper = this.menuWrappers.find(menuWrapper => {
      return (
        menuWrapper.id === id ||
        menuWrapper.menu() === menu
      );
    });

    if (!menuWrapper) {
      throw new Error(CONTEXT_MENU_ERRORS.NO_WRAPPER_FOR_MENU);
    }

    return menuWrapper;
  }

  private _removeMenuWrapper(menuWrapper: ContextMenuWrapper) {
    this.menuWrappers = this.menuWrappers.filter(({ id }) => id !== menuWrapper.id);
  }

  private get _randomId() {
    return `context-menu-${uuidv4()}`;
  }
}
