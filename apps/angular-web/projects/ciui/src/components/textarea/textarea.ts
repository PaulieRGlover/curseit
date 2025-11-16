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

@Component({
  selector: 'ciui-textarea',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiTextarea),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiTextarea extends CiuiBaseInput {
  type = input<HTMLInputTypeAttribute>('text');

  activeElements = computed(() => [this._textareaRef().nativeElement]);

  constructor() {
    super();
  }

  @HostBinding('class')
  override get hostClasses() {
    return [...super.hostClasses, 'ciui-textarea'];
  }

  onInput(event: Event) {
    this._resetAngryDelete();
    const newValue = (event.target as HTMLInputElement).value;
    this._onChange(newValue);
  }

  applyWrite(value: any) {
    this._renderer.setProperty(this._textareaRef().nativeElement, 'value', value);
  }

  protected _textareaRef = viewChild.required<ElementRef<HTMLTextAreaElement>>('textarea');
}
