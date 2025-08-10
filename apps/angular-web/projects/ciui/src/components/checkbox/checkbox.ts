import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import type { MaybeUndefined } from '@curseit/types';

import { BaseInput } from '../../shared/components/base-input/base-input';
import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { Size, Theme } from '../../shared/constants';
import { FormErrorService } from '../../shared/services/form-error.service';

@Component({
  selector: 'ciui-checkbox',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './checkbox.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiCheckbox),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiCheckbox extends BaseInput {
  formErrorService = inject(FormErrorService);

  formControl = input.required<FormControl>();
  label = input.required<string>();

  name = input<MaybeUndefined<string>>();
  ariaLabel = input<MaybeUndefined<string>>();
  labelInvisible = input<boolean, any>(false, { transform: booleanAttribute });
  row = input<boolean, any>(false, { transform: booleanAttribute });
  theme = input<Theme>('white');
  size = input<Size>('medium');
  transparent = input<boolean, any>(false, { transform: booleanAttribute });
  constructor() {
    super();
  }

  @HostBinding('class')
  get hostClasses() {
    return [...this.classes(), 'ciui-input--checkbox'];
  }

  onInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).checked;
    this._onChange(newValue);
  }

  applyWrite(value: boolean) {
    this._renderer.setProperty(this._checkboxRef().nativeElement, 'checked', value);
  }

  protected _checkboxRef = viewChild.required<ElementRef<HTMLInputElement>>('checkbox');
}
