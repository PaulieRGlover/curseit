import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import type { HTMLInputTypeAttribute } from 'react';

import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { FormErrorService } from '../../shared/services/form-error.service';
import { CiuiBaseInput } from '../../shared/components/base-input/base-input';

const dateToInputFormat = (date: Date): string => {
  const year   = date.getFullYear();
  const month  = String(date.getMonth() + 1).padStart(2, '0');
  const day    = String(date.getDate()).padStart(2, '0');
  const hours  = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

@Component({
  selector: 'ciui-date-input',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './date-input.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiDateInput),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiDateInput extends CiuiBaseInput {
  type = input<HTMLInputTypeAttribute>('date');

  activeElements = computed(() => [this._inputRef().nativeElement]);

  constructor() {
    super();
  }

  @HostBinding('class')
  override get hostClasses() {
    return [...super.hostClasses, 'ciui-date-input'];
  }

  onInput(event: Event) {
    this._resetAngryDelete();
    const newValue = (event.target as HTMLInputElement).value;
    this._onChange(new Date(newValue));
  }

  applyWrite(value: any) {
    if (value instanceof Date) {
      const formattedValue = dateToInputFormat(value);
      this._renderer.setProperty(this._inputRef().nativeElement, 'value', formattedValue);
    }
  }

  protected _inputRef = viewChild.required<ElementRef<HTMLTextAreaElement>>('input');
}
