import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import type { HTMLInputTypeAttribute } from 'react';

import { BaseInput } from '../../shared/components/base-input/base-input';
import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { Size, Theme } from '../../shared/constants';
import { FormErrorService } from '../../shared/services/form-error.service';
import { SelectOption } from '../select/select';

type ValueTuple = [string | number, string];

@Component({
  selector: 'ciui-input-select',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './input-select.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiInputSelect),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiInputSelect extends BaseInput {
  formErrorService = inject(FormErrorService);

  formControl = input.required<FormControl>();
  label = input.required<string>();
  labelSelect = input.required<string>();
  options = input.required<Array<string | SelectOption>>();

  type = input<HTMLInputTypeAttribute>('text');
  name = input<string>();
  labelKey = input<string>('label');
  placeholder = input<string>();
  ariaLabel = input<string>();
  ariaLabelSelect = input<string>();
  labelInvisible = input<boolean, any>(false, { transform: booleanAttribute });
  row = input<boolean, any>(false, { transform: booleanAttribute });
  theme = input<Theme>('white');
  size = input<Size>('medium');
  transparent = input<boolean, any>(false, { transform: booleanAttribute });

  inputId = computed(() => `${this.id()}-input`);
  selectId = computed(() => `${this.id()}-select`);

  constructor() {
    super();
  }

  @HostBinding('class')
  get hostClasses() {
    return [...this.classes(), 'ciui-input--input-select'];
  }

  onInput() {
    const inputValue = this._inputRef().nativeElement.value;
    const newValue: ValueTuple = [
      this.type() === 'number' ? parseFloat(inputValue) : inputValue,
      this._selectRef().nativeElement.value,
    ];
    this._onChange(newValue);
    // TODO: don't forget to emulate change after adding the `select.ts` component
  }

  applyWrite(value: ValueTuple) {
    this._renderer.setProperty(this._inputRef().nativeElement, 'value', value[0]);
    this._renderer.setProperty(this._selectRef().nativeElement, 'value', value[1]);
  }

  protected _inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  protected _selectRef = viewChild.required<ElementRef<HTMLInputElement>>('select');
}
