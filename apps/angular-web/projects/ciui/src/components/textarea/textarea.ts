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

import type { HTMLInputTypeAttribute } from 'react';

import { BaseInput } from '../../shared/components/base-input/base-input';
import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { Size, Theme } from '../../shared/constants';
import { FormErrorService } from '../../shared/services/form-error.service';

@Component({
  selector: 'ciui-textarea',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './textarea.html',
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
export class CiuiTextarea extends BaseInput {
  formErrorService = inject(FormErrorService);

  formControl = input.required<FormControl>();
  label = input.required<string>();

  type = input<HTMLInputTypeAttribute>('text');
  name = input<string>();
  placeholder = input<string>();
  ariaLabel = input<string>();
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
    return [...this.classes(), 'ciui-input--textarea'];
  }

  onInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this._onChange(newValue);
  }

  applyWrite(value: any) {
    this._renderer.setProperty(this._textareaRef().nativeElement, 'value', value);
  }

  protected _textareaRef = viewChild.required<ElementRef<HTMLTextAreaElement>>('textarea');
}
