import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  viewChild,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import type { HTMLInputTypeAttribute } from 'react';

import { Nullable } from '@curseit/types';

import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { FormErrorService } from '../../shared/services/form-error.service';
import { CiuiIcon } from '../icon/icon';
import { CiuiSelect, SelectOption } from '../select/select';
import { CiuiBaseInput } from '../../shared/components/base-input/base-input';

type ValueTuple<T> = [string | number, Nullable<T>];

@Component({
  selector: 'ciui-input-select',
  imports: [ReactiveFormsModule, CiuiInputInfo, CiuiSelect, CiuiIcon],
  templateUrl: './input-select.html',
  styleUrl: './input-select.scss',
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
export class CiuiInputSelect<T extends string | SelectOption> extends CiuiBaseInput {
  labelSelect = input.required<string>();
  options = input.required<Array<T>>();

  type = input<HTMLInputTypeAttribute>('text');
  min = input<number>();
  max = input<number>();
  autocomplete = input<string>('off');
  labelKey = input<string>('label');
  ariaLabelSelect = input<string>();
  noSelectDisable = input<boolean, any>(false, { transform: booleanAttribute });

  selectValue = new FormControl<Nullable<T>>(null);

  activeElements = computed(() => [this._inputRef().nativeElement]);
  inputId = computed(() => `${this.id()}-input`);
  selectId = computed(() => `${this.id()}-select`);

  constructor() {
    super();
  }

  onInput() {
    this._resetAngryDelete();
    const inputValue = this._inputRef().nativeElement.value;
    const newValue: ValueTuple<T> = [
      this.type() === 'number' ? parseFloat(inputValue) || 0 : inputValue,
      this.selectValue.value,
    ];
    this._onChange(newValue);
  }

  applyWrite(value: ValueTuple<T>) {
    this._renderer.setProperty(this._inputRef().nativeElement, 'value', value[0]);
    this.selectValue.setValue(value[1]);
  }

  override setDisabledState(isDisabled: boolean) {
    super.setDisabledState(isDisabled);

    if (this.noSelectDisable()) {
      return;
    }

    if (isDisabled) {
      this.selectValue.disable({ emitEvent: true });
    } else {
      this.selectValue.enable({ emitEvent: true });
    }
  }

  @HostBinding('class')
  override get hostClasses() {
    return [...super.hostClasses, 'ciui-input-select'];
  }

  protected _inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
}
