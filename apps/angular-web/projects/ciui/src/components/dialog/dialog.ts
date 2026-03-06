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

import { CiuiButton } from '../button/button';

@Component({
  selector: 'ciui-dialog',
  imports: [CiuiButton],
  templateUrl: './dialog.html',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiDialog {
  element = inject(ElementRef);

  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  isOpened = signal(false);
  modal = signal(true);

  toggled = output<boolean>();

  toggle(state = !this.isOpened, { emit = false, modal = true } = {}) {
    this.isOpened.set(state);
    this.modal.set(modal);

    if (state) {
      this.dialogRef().nativeElement[modal ? 'showModal' : 'show']();
    } else {
      this.dialogRef().nativeElement.close();
    }

    if (emit) {
      this.toggled.emit(state);
    }
  }

  handleDialogClick(event: MouseEvent) {
    const clickStartedInside = this._clickStartedInside;
    this._clickStartedInside = false;

    if (event.target === event.currentTarget && !clickStartedInside) {
      this.toggle(false, { emit: true });
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
