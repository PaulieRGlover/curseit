import { ElementRef, Injectable } from '@angular/core';

import { Nullable } from '@curseit/types';

import { CiuiDialog } from './dialog';

export type ContextMenuWrapper = {
  id: string | ElementRef['nativeElement'];
  dialog: CiuiDialog;
};

@Injectable({ providedIn: 'root' })
export class DialogService {
  dialog: Array<ContextMenuWrapper> = [];

  registerDialog(dialog: CiuiDialog, element: ElementRef, dialogId?: string) {
    this.dialog.push({ id: dialogId ?? element.nativeElement, dialog: dialog });
  }

  unregisterDialog(dialog: CiuiDialog) {
    this.dialog = this.dialog.filter(wrapper => wrapper.dialog !== dialog);
  }

  getDialog(dialogId: string): Nullable<CiuiDialog> {
    return this.dialog.find(({ id }) => id === dialogId)?.dialog ?? null;
  }

  toggleDialog(
    locator: CiuiDialog | string,
    value?: boolean,
  ): void {
    const dialog = locator instanceof CiuiDialog ? locator : this.getDialog(locator);
    if (!dialog) {
      return;
    }

    value = value ?? !dialog.isOpened();
    if (!value) {
      this.dialog
        .filter(wrapper => wrapper.dialog !== dialog)
        .forEach(({ dialog: menu }) => menu.toggle(false));
    }

    dialog.toggle(value);
  }
}
