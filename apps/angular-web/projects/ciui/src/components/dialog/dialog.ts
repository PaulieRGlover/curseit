import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { DialogService } from './dialog.service';

@Component({
  selector: 'ciui-dialog',
  templateUrl: './dialog.html',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiDialog {
  element = inject(ElementRef);
  dialogService = inject(DialogService);

  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  isOpened = signal(false);

  toggled = output<boolean>();

  ngOnInit() {
    this.dialogService.registerDialog(this, this.element);
  }

  ngOnDestroy() {
    this.dialogService.unregisterDialog(this);
  }

  toggle(state = !this.isOpened, emit = false) {
    this.isOpened.set(state);
    if (state) {
      this.dialogRef().nativeElement.showModal();
      if (emit) {
        this.toggled.emit(state);
      }
    } else {
      this.dialogRef().nativeElement.close();
      if (emit) {
        this.toggled.emit(state);
      }
    }
  }

  handleDialogClick(event: MouseEvent) {
    const clickStartedInside = this._clickStartedInside;
    this._clickStartedInside = false;

    if (event.target === event.currentTarget && !clickStartedInside) {
      this.dialogService.toggleDialog(this, false, true);
    }
  }

  handleDialogClose() {
    this.toggled.emit(false);
  }

  handleDialogMousedown(event: Event) {
    if (event.target !== event.currentTarget) {
      this._clickStartedInside = true;
    }
  }

  @HostBinding('class')
  hostClass = 'ciui-dialog';

  private _clickStartedInside = false;
}
