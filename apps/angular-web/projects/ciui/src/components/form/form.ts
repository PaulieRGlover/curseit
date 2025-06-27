import { Component, ElementRef, HostBinding, HostListener, Input, booleanAttribute, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { FormErrorService } from '../../shared/services/form-error.service';
import { CiuiButton } from '../button/button';

@Component({
  selector: '[ciui-form]',
  imports: [CiuiButton],
  templateUrl: './form.html',
  providers: [FormErrorService],
})
export class CiuiForm {
  formErrorService = inject(FormErrorService);

  @Input({ alias: 'formGroup', required: true }) control!: AbstractControl;
  @Input({ transform: booleanAttribute }) loading = false;

  @HostBinding('class') hostClasses = 'ciui-form';

  constructor(private form: ElementRef<HTMLFormElement>) {
    this.form.nativeElement.addEventListener('submit', event => {
      if (this.loading || !this.control.valid) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  ngOnInit() {
    this.formErrorService.initialize(this.control);
  }
}
