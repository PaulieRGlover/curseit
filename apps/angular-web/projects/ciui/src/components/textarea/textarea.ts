import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import type { HTMLInputTypeAttribute } from 'react';

import type { MaybeUndefined } from '@curseit/types';

import { BaseInput } from '../../shared/components/base-input/base-input';
import { InputInfo } from '../../shared/components/input-info/input-info';
import { SIZES, THEMES } from '../../shared/constants';
import { FormErrorService } from '../../shared/services/form-error.service';

@Component({
  selector: 'ciui-textarea',
  imports: [ReactiveFormsModule, InputInfo],
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

  @Input({ required: true }) formControl!: FormControl;
  @Input({ required: true }) label!: string;

  @Input() type: HTMLInputTypeAttribute = 'text';
  @Input() name: MaybeUndefined<string>;
  @Input() value: string = '';
  @Input() placeholder: MaybeUndefined<string>;
  @Input() ariaLabel: MaybeUndefined<string>;

  @Input({ transform: booleanAttribute }) labelInvisible = false;
  @Input({ transform: booleanAttribute }) row = false;
  @Input() theme: THEMES = 'white';
  @Input() size: SIZES = 'default';
  @Input({ transform: booleanAttribute }) transparent = false;

  constructor() {
    super();
  }

  @HostBinding('class')
  get hostClasses() {
    return [...this.classes, 'ciui-input--textarea'];
  }

  onInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChange(newValue);
  }
}
