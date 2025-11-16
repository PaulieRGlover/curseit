import { ElementRef, Injectable } from '@angular/core';

import { Nullable } from '@curseit/types';

import { CiuiContextMenu } from '../context-menu/context-menu';

import { CiuiDialog } from './dialog';

type Locator = CiuiDialog | HTMLElement | string;

export type DialogWrapper = {
  id: string | HTMLElement;
  dialog: CiuiDialog;
};

@Injectable({ providedIn: 'root' })
export class DialogService {
  dialogWindows: Array<DialogWrapper> = [];

  registerDialog(dialog: CiuiDialog, element: ElementRef) {
    this.dialogWindows.push({ id: element.nativeElement, dialog });
  }

  unregisterDialog(dialog: CiuiDialog) {
    this.dialogWindows = this.dialogWindows.filter(wrapper => wrapper.dialog !== dialog);
  }

  getDialogWrapper(locator: Locator): Nullable<DialogWrapper> {
    const dialogWrapper = this.dialogWindows.find(({ id, dialog }) => {
      return locator instanceof CiuiDialog
        ? locator === dialog
        : locator === id;
    });

    return dialogWrapper ?? null;
  }

  toggleDialog(
    locator: Locator,
    value?: boolean,
    emit = false,
  ): void {
    const dialogWrapper = this.getDialogWrapper(locator);
    if (!dialogWrapper) {
      return;
    }

    const { dialog } = dialogWrapper;

    value = value ?? !dialog.isOpened();

    dialog.toggle(value, emit);
  }
}
