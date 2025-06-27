import {
  Component,
  Input,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import type { HTMLInputTypeAttribute } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { MaybeUndefined } from '@curseit/types';

import { FormErrorService } from '../../shared/services/form-error.service';
import { CiuiIcon } from '../icon/icon';

export const ControlErrorsMap: Record<string, string> = {
  required: 'This field is required',
};

export type INPUT_THEMES = 'white' | 'black';
export type INPUT_SIZES = 'small' | 'default';

@Component({
  selector: 'ciui-input',
  imports: [ReactiveFormsModule, CiuiIcon],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiInput),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiInput implements ControlValueAccessor {
  public formErrorService = inject(FormErrorService);

  @Input({ required: true }) control!: AbstractControl;
  @Input({ required: true }) label!: string;

  @Input() type: HTMLInputTypeAttribute = 'text';
  @Input() name: MaybeUndefined<string>;
  @Input() value = '';
  @Input() placeholder: MaybeUndefined<string>;

  @Input({ transform: booleanAttribute }) labelInvisible = false;
  @Input() theme: INPUT_THEMES = 'white';
  @Input() size: INPUT_SIZES = 'default';
  @Input({ transform: booleanAttribute }) transparent = false;

  public id = signal('');
  public hasOneError = computed(() => this.formErrorService.errors().length === 1);
  public tempFormattedErrors = computed(() => {
    return this.formErrorService
      .errors()
      .map(error => `- ${error}`)
      .join('\n');
  });

  ngOnInit() {
    this.id.set(this.computeId());
    this.formErrorService.initialize(this.control);
  }

  writeValue(value: string) {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChange(newValue);
  }

  onBlur() {
    this.control?.markAsTouched();
  }

  private readonly uuid = uuidv4();
  private onChange = (value: any) => {};
  private onTouched = () => {};

  private computeId() {
    const validReadableId = (this.label ?? CiuiInput.name).replace(/[\W]/g, '-').toLowerCase();
    return `${validReadableId}_${this.uuid}`;
  }
}
