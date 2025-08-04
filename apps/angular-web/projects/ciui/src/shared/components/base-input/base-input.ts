import { Component, Injectable, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { FormErrorService } from '../../services/form-error.service';

@Injectable()
export abstract class BaseInput implements OnInit, ControlValueAccessor {
  abstract formErrorService: FormErrorService;
  abstract formControl: FormControl;

  abstract value: any;
  abstract label: string;
  abstract theme: string;
  abstract size: string;
  abstract transparent: boolean;
  abstract row: boolean;
  abstract labelInvisible: boolean;

  abstract onInput(event: Event): void;

  id = signal('');

  get classes() {
    return [
      'ciui-input',
      `ciui-input--theme-${this.theme}`,
      `ciui-input--size-${this.size}`,
      this.formErrorService.hasErrors() ? 'ciui-input--errored' : '',
      this.transparent ? 'ciui-input--transparent' : '',
      this.row ? 'ciui-input--row' : '',
      this.labelInvisible ? 'ciui-input--label-invisible': '',
    ];
  }

  ngOnInit() {
    this.id.set(this.computeId());
    this.formErrorService.initialize(this.formControl);
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onBlur() {
    this.formControl?.markAsTouched();
  }
  
  protected onChange = (value: any) => {};
  protected onTouched = () => {};

  private readonly uuid = uuidv4();
  private computeId() {
    const validReadableId = this.label.replace(/[\W]/g, '-').toLowerCase();
    return `${validReadableId}_${this.uuid}`;
  }
}
