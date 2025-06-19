import { Component, EventEmitter, Input, Optional, Output, Self, booleanAttribute, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, PristineChangeEvent, ReactiveFormsModule, StatusChangeEvent, TouchedChangeEvent } from '@angular/forms';

import type { HTMLInputTypeAttribute } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { MaybeUndefined } from '@curseit/types';

import { CiuiIcon } from '../icon/icon';
import { filter } from 'rxjs';

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
  ],
})
export class CiuiInput implements ControlValueAccessor {
  private uuid = uuidv4();
  private onChange = (value: any) => {};
  private onTouched = () => {};

  @Input({ required: true }) label!: string;
  @Input() type: HTMLInputTypeAttribute = 'text';
  @Input() name: MaybeUndefined<string>;
  @Input() value = '';
  @Input({ transform: booleanAttribute }) labelInvisible = false;
  @Input() placeholder: MaybeUndefined<string>;
  @Input() theme: INPUT_THEMES = 'white';
  @Input({ transform: booleanAttribute }) transparent = false;
  @Input() size: INPUT_SIZES = 'default';
  @Input({ required: true }) control!: AbstractControl;

  id: string = '';
  errors: Array<string> = [];
  isTouched = false;

  get showErrors() {
    return this.errors.length > 0 && this.isTouched;
  }

  get hasOneError() {
    return this.errors.length === 1;
  }

  get tempFormattedErrors() {
    return this.errors.map(error => `- ${error}`).join('\n');
  }

  ngOnInit() {
    this.id = this.computeId();
    this.subscribeToControlEvents();
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
  
  
  private computeId() {
    const validReadableId = (this.label ?? CiuiInput.name).replace(/[\W]/g, '-').toLowerCase();
    return `${validReadableId}_${this.uuid}`;
  }

  private subscribeToControlEvents() {
    this.control.events.subscribe(event => {
      switch (true) {
        case (event instanceof StatusChangeEvent): {
          this.errors = this.computeErrors();
          break;
        }
        case (event instanceof TouchedChangeEvent): {
          this.errors = this.computeErrors();
          this.isTouched = true;
          break;
        }
        case (event instanceof PristineChangeEvent): {
          if (event.pristine) {
            this.isTouched = false;
          }

          break;
        }
      }
    });
  }

  private computeErrors() {
    return this.control.errors
      ? Object.keys(this.control.errors)
        .map(key => {
          const errorDescription = this.control.errors?.[key];
          return (
            (typeof errorDescription === 'string' ? errorDescription : null) ??
            ControlErrorsMap[key] ??
            null
          );
        })
        .filter(error => error)
      : [];
  }
}
