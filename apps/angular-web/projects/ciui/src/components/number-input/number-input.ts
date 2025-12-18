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

import { Nullable } from '@curseit/types';

import { CiuiBaseInput } from '../../shared/components/base-input/base-input';
import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { FormErrorService } from '../../shared/services/form-error.service';

@Component({
  selector: 'ciui-number-input',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './number-input.html',
  styleUrl: './number-input.scss',
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
export class CiuiNumberInput extends CiuiBaseInput<number> {
  type = input<HTMLInputTypeAttribute>('text');
  min = input<string | number>();
  max = input<string | number>();
  step = input<string | number>();
  autocomplete = input<string>('off');
  showArrows = input<boolean, any>(false, { transform: booleanAttribute });
  outOf = input<Nullable<number>>(null);

  activeElements = computed(() => [this._inputRef().nativeElement]);
  hasOutOf = computed(() => this.outOf() !== null);

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
      ...super.hostClasses,
      'ciui-number-input',
      this.showArrows() ? 'ciui-number-input--show-arrows' : '',
      this.hasOutOf() ? 'ciui-number-input--has-out-of' : '',
    ];
  }

  protected _inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
}
