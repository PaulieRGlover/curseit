import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
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
  selector: 'ciui-number-input',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './number-input.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiNumberInput),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiNumberInput extends CiuiBaseInput {
  type = input<HTMLInputTypeAttribute>('text');
  min = input<string | number>();
  max = input<string | number>();
  step = input<string | number>();
  autocomplete = input<string>('off');
  showArrows = input<boolean, any>(false, { transform: booleanAttribute });

  override input = output<number>();

  activeElements = computed(() => [this._inputRef().nativeElement]);

  constructor() {
    super();
  }

  onInput(event: Event) {
    this._resetAngryDelete();
    const newValue = parseFloat((event.target as HTMLInputElement).value) || 0;

    this._onChange(newValue);
    this.input.emit(newValue);
  }

  onChange(event: Event) {
    const newValue = parseFloat((event.target as HTMLInputElement).value) || 0;
    this.change.emit(newValue);
  }

  applyWrite(value: any) {
    this._renderer.setProperty(this._inputRef().nativeElement, 'value', value);
  }

  @HostBinding('class')
  override get hostClasses() {
    return [
      this.showArrows() ? 'ciui-input--show-arrows' : '',
      ...super.hostClasses
    ];
  }

  protected _inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
}
