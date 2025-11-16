import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

import { DIALOG_ERRORS } from '../../shared/constants';

import { DialogService } from './dialog.service';

@Directive({
  selector: '[ciui-dialog-trigger]',
})
export class CiuiDialogTrigger {
  private dialogService = inject(DialogService);

  dialogId = input.required<string>();

  element = inject(ElementRef);

  get dialog() {
    return this.dialogService.getDialogWrapper(this.dialogId())?.dialog;
  }

  ngAfterViewInit() {
    if (!this.dialog) {
      throw new Error(DIALOG_ERRORS.NO_DIALOG);
    }
  }

  @HostListener('click')
  onClick() {
    this.dialogService.toggleDialog(this.dialogId());
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: Event['target']) {
    if (!this.dialog) {
      return;
    }

    const isOpened = this.dialog.isOpened();
    const isWithinContextMenu = this.dialog.element.nativeElement.contains(target);
    const isWithinDirectiveCarrier = this.element.nativeElement.contains(target);
    if (
      isOpened &&
      !isWithinContextMenu &&
      !isWithinDirectiveCarrier
    ) {
      this.dialogService.toggleDialog(this.dialog, false);
    }
  }
}
