import {
  Component,
  HostBinding,
  OnInit,
  Renderer2,
  Signal,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { Size, Theme } from '../../constants';
import { AngryDeleteService } from '../../services/angry-delete.service';
import { FormErrorService } from '../../services/form-error.service';

@Component({
  selector: 'ciui-base-input',
  template: '<div>ABSTRACT COMPONENT</div>',
  encapsulation: ViewEncapsulation.None,
})
export abstract class CiuiBaseInput implements OnInit, ControlValueAccessor {
  formErrorService = inject(FormErrorService);
  protected _renderer = inject(Renderer2);
  private _angryDeleteService = inject(AngryDeleteService);

  abstract activeElements: Signal<Array<HTMLElement>>;

  formControl = input.required<AbstractControl>();
  label = input.required<string>();

  name = input<string>('');
  theme = input<Theme>('white');
  size = input<Size>('medium');
  row = input<boolean, any>(false, { transform: booleanAttribute });
  placeholder = input<string>();
  labelInvisible = input<boolean, any>(false, { transform: booleanAttribute });
  ariaLabel = input<string>();

  angryDelete = output();

  id = signal('');

  ngOnInit() {
    this.id.set(this._computeId());
    this.formErrorService.initialize(this.formControl());
    this._angryDeleteService.register(this);
  }

  ngAfterViewInit() {
    this._isViewInitialized = true;
      
    if (this._pendingWrite !== undefined) {
      this.applyWrite(this._pendingWrite);
      this._pendingWrite = undefined;
    }

    if (this._pendingFocus) {
      this.setFocus();
      this._pendingFocus = false;
    }
  }

  abstract applyWrite(value: any): void;

  writeValue(value: any) {
    if (this._isViewInitialized) {
      this.applyWrite(value);
    } else {
      this._pendingWrite = value;
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  onBlur() {
    this.formControl().markAsTouched();
  }

  setDisabledState(isDisabled: boolean) {
    this.activeElements().forEach(element => {
      if (isDisabled) {
        this._renderer.setAttribute(element, 'disabled', '');
      } else {
        this._renderer.removeAttribute(element, 'disabled');
      }
    });
  }

  setFocus() {
    if (this._isViewInitialized) {
      this.activeElements()[0]?.focus();
    } else {
      this._pendingFocus = true;
    }
  }

  @HostBinding('class')
  get hostClasses() {
    return [
      'ciui-input',
      `ciui-input--theme-${this.theme()}`,
      `ciui-input--size-${this.size()}`,
      this.formControl().disabled ? 'ciui-input--disabled' : '',
      this.formErrorService.hasErrors() ? 'ciui-input--errored' : '',
      this.formErrorService.hasOneError() ? 'ciui-input--one-error' : '',
      this.row() ? 'ciui-input--row' : '',
      this.labelInvisible() ? 'ciui-input--label-invisible' : '',
    ];
  }

  protected _onChange = (value: any) => {};
  protected _onTouched = () => {};
  protected _resetAngryDelete() {
    this._angryDeleteService.resetAngryDelete();
  }

  private readonly _uuid = uuidv4();
  private _computeId() {
    const validReadableId = this.label().replace(/[\W]/g, '-').toLowerCase();
    return `${validReadableId}_${this._uuid}`;
  }
  private _isViewInitialized = false;
  private _pendingWrite: any = undefined;
  private _pendingFocus = false;
}
