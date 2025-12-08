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
  showArrows = input<boolean, any>(false, { transform: booleanAttribute });

  activeElements = computed(() => [this._inputRef().nativeElement]);

  constructor() {
    super();
  }

  onInput(event: Event) {
    this._resetAngryDelete();
    const newValue = (event.target as HTMLInputElement).value;

    this._onChange(this.type() === 'number' ? parseFloat(newValue) || 0 : newValue);
  }

  applyWrite(value: any) {
    this._renderer.setProperty(this._inputRef().nativeElement, 'value', value);
  }

  @HostBinding('class')
  override get hostClasses() {
    return [
      this.showArrows() && this.type() === 'number' ? 'ciui-input--show-arrows' : '',
      ...super.hostClasses
    ];
  }

  protected _inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
}
