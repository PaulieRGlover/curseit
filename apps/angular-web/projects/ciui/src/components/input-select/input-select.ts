import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  computed,
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
import { SelectOption } from '../select/select';

type ValueTuple = [string | number, string];

@Component({
  selector: 'ciui-input-select',
  imports: [ReactiveFormsModule, InputInfo],
  templateUrl: './input-select.html',
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
export class CiuiInputSelect extends BaseInput {
  formErrorService = inject(FormErrorService);

  @Input({ required: true }) formControl!: FormControl;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) labelSelect!: string;
  @Input({ required: true }) options!: Array<string | SelectOption>;

  @Input() type: HTMLInputTypeAttribute = 'text';
  @Input() name: MaybeUndefined<string>;
  @Input() value: ValueTuple = ['', ''];
  @Input() placeholder: MaybeUndefined<string>;
  @Input() ariaLabel: MaybeUndefined<string>;
  @Input() ariaLabelSelect: MaybeUndefined<string>;

  @Input({ transform: booleanAttribute }) labelInvisible = false;
  @Input({ transform: booleanAttribute }) row = false;
  @Input() theme: THEMES = 'white';
  @Input() size: SIZES = 'default';
  @Input({ transform: booleanAttribute }) transparent = false;

  @ViewChild('input')
  inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('select')
  selectRef!: ElementRef<HTMLSelectElement>;

  inputId = computed(() => `${this.id()}-input`);
  selectId = computed(() => `${this.id()}-select`);

  constructor() {
    super();
  }

  @HostBinding('class')
  get hostClasses() {
    return [...this.classes, 'ciui-input--input-select'];
  }

  onInput() {
    const newValue: ValueTuple = [
      this.inputRef.nativeElement.value,
      this.selectRef.nativeElement.value,
    ];
    this.value = newValue;
    this.onChange(newValue);
  }
}
