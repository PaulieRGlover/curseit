import {
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import type { HTMLInputTypeAttribute } from 'react';

import { CiuiBaseInput } from '../../shared/components/base-input/base-input';
import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { FormErrorService } from '../../shared/services/form-error.service';

@Component({
  selector: 'ciui-input',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './input.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiInput),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiInput extends CiuiBaseInput {
  type = input<HTMLInputTypeAttribute>('text');
  min = input<string | number>();
  max = input<string | number>();
  step = input<string | number>();
  autocomplete = input<string>('off');

  override input = output<string>();

  activeElements = computed(() => [this._inputRef().nativeElement]);

  constructor() {
    super();
  }

  onInput(event: Event) {
    this._resetAngryDelete();
    const newValue = (event.target as HTMLInputElement).value;

    this._onChange(newValue);
    this.input.emit(newValue);
  }

  onChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.change.emit(newValue);
  }

  applyWrite(value: any) {
    this._renderer.setProperty(this._inputRef().nativeElement, 'value', value);
  }

  protected _inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
}
