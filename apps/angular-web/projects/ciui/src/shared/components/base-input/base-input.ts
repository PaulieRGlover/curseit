import {
  ElementRef,
  Injectable,
  InputSignal,
  OnInit,
  Renderer2,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { Size, Theme } from '../../constants';
import { FormErrorService } from '../../services/form-error.service';

@Injectable()
export abstract class BaseInput implements OnInit, ControlValueAccessor {
  protected _renderer = inject(Renderer2);

  abstract formErrorService: FormErrorService;
  abstract formControl: InputSignal<FormControl>;

  abstract label: InputSignal<string>;
  abstract theme: InputSignal<Theme>;
  abstract size: InputSignal<Size>;
  abstract transparent: InputSignal<boolean>;
  abstract row: InputSignal<boolean>;
  abstract labelInvisible: InputSignal<boolean>;

  id = signal('');

  classes = computed(() => [
    'ciui-input',
    `ciui-input--theme-${this.theme()}`,
    `ciui-input--size-${this.size()}`,
    this.formErrorService.hasErrors() ? 'ciui-input--errored' : '',
    this.transparent() ? 'ciui-input--transparent' : '',
    this.row() ? 'ciui-input--row' : '',
    this.labelInvisible() ? 'ciui-input--label-invisible' : '',
  ]);

  ngOnInit() {
    this.id.set(this._computeId());
    this.formErrorService.initialize(this.formControl());
  }

  ngAfterViewInit() {
    if (this._pendingWrite !== undefined) {
      this.applyWrite(this._pendingWrite);
      this._pendingWrite = undefined;
      this._isViewInitialized = true;
    }
  }

  abstract applyWrite(value: any): void;

  writeValue(value: any) {
    if (!this._isViewInitialized) {
      this._pendingWrite = value;
    } else {
      this.applyWrite(value);
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

  protected _onChange = (value: any) => {};
  protected _onTouched = () => {};

  private readonly _uuid = uuidv4();
  private _computeId() {
    const validReadableId = this.label().replace(/[\W]/g, '-').toLowerCase();
    return `${validReadableId}_${this._uuid}`;
  }
  private _isViewInitialized = false;
  private _pendingWrite: any = undefined;
}
