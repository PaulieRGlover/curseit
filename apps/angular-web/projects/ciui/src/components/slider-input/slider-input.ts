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

import { CiuiBaseInput } from '../../shared/components/base-input/base-input';
import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { FormErrorService } from '../../shared/services/form-error.service';

@Component({
  selector: 'ciui-slider-input',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './slider-input.html',
  styleUrl: './slider-input.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiSliderInput),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiSliderInput extends CiuiBaseInput<number> {
  type = input<HTMLInputTypeAttribute>('text');
  min = input<string | number>(0);
  max = input<string | number>(1);
  step = input<string | number>(0.1);
  orientation = input<'vertical' | 'horizontal'>('horizontal');

  activeElements = computed(() => [this._inputRef().nativeElement]);
  percent = computed(() => {
    const value_ = this.value();
    const max_ = this.max();
    return `${(value_ ?? 0) / (typeof max_ === 'number' ? max_ : parseFloat(max_)) * 100}%`;
  });

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
      'ciui-slider-input',
      `ciui-slider-input--${this.orientation()}`,
    ];
  }

  @HostBinding('style.--ciui-slider-input-track-gradient')
  get trackGradient() {
    return `linear-gradient(
      ${this.orientation() === 'horizontal' ? 90 : 180}deg,
      #9184ff 6%,
      #8080ff ${this.percent()},
      #fffcff ${this.percent()})
    `;
  }

  protected _inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
}
