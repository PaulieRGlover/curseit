import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ciui-dialog',
  templateUrl: './dialog.html',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiDialog {
  element = inject(ElementRef);
  dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  isOpened = signal(false);

  close = output<void>();
  open = output<void>();

  public toggle(state = !this.isOpened, emit = false) {
    this.isOpened.set(state);
    if (state) {
      this.dialog().nativeElement.showModal();
      if (emit) {
        this.open.emit();
      }
    } else {
      this.dialog().nativeElement.close();
      if (emit) {
        this.close.emit();
      }
    }
  }

  public handleDialogClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.toggle(false, true);
    }
  }

  @HostBinding('class')
  hostClass = 'ciui-dialog';
}
