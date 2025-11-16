import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { FormErrorService } from '../../shared/services/form-error.service';
import { CiuiButton } from '../button/button';

@Component({
  selector: '[ciui-form]',
  imports: [CiuiButton],
  templateUrl: './form.html',
  providers: [FormErrorService],
  encapsulation: ViewEncapsulation.None,
})
export class CiuiForm {
  formErrorService = inject(FormErrorService);

  control = input.required<AbstractControl>({ alias: 'formGroup' });
  loading = input<boolean, any>(false, { transform: booleanAttribute });

  @HostBinding('class') hostClasses = 'ciui-form';

  constructor(private form: ElementRef<HTMLFormElement>) {
    this.form.nativeElement.addEventListener(
      'submit',
      event => {
        if (this.loading() || !this.control().valid) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      true,
    );
  }

  ngOnInit() {
    this.formErrorService.initialize(this.control());
  }
}
