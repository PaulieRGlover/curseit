import {
  Component,
  HostBinding,
  OnInit,
  Renderer2,
  Signal,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Nullable } from '@curseit/types';

import { Size, Theme } from '../../constants';
import { AngryDeleteService } from '../../services/angry-delete.service';
import { FormErrorService } from '../../services/form-error.service';

@Component({
  selector: 'ciui-base-input',
  template: '<div>ABSTRACT COMPONENT</div>',
  encapsulation: ViewEncapsulation.None,
})
export abstract class CiuiBaseInput<T> implements OnInit, ControlValueAccessor {
  formErrorService = inject(FormErrorService);
  protected _renderer = inject(Renderer2);
  private _angryDeleteService = inject(AngryDeleteService);

  abstract activeElements: Signal<Array<HTMLElement>>;

  label = input.required<string>();

  formControl = input<FormControl<Nullable<T>>>();
  valueSource = input<Nullable<T>>(null, { alias: 'value' });
  name = input<string>('');
  theme = input<Theme>('white');
  size = input<Size>('medium');
  row = input<boolean, any>(false, { transform: booleanAttribute });
  placeholder = input<string>();
  labelInvisible = input<boolean, any>(false, { transform: booleanAttribute });
  ariaLabel = input<string>();

  input = output<Nullable<T>>();
  change = output<Nullable<T>>();
  angryDelete = output();

  id = signal('');

  value = computed<Nullable<T>>(() => {
    const formControl_ = this.formControl();
    if (formControl_) {
      return this._formControlValueSignal();
    } else {
      return this.valueSource();
    }
  });

  constructor() {
    effect(() => {
      const value_ = this.valueSource();
      const formControl_ = this.formControl();

      untracked(() => {
        if (!formControl_) {
          this.writeValue(value_);
        }
      });
    });
  }

  ngOnInit() {
    this.id.set(this._computeId());

    const formControl_ = this.formControl();
    if (formControl_) {
      this.formErrorService.initialize(formControl_);
      this._formControlValueSubscription = formControl_.valueChanges.subscribe(value => {
        this._formControlValueSignal.set(value);
      });
    }

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

  ngOnDestroy() {
    if (this._formControlValueSubscription) {
      this._formControlValueSubscription.unsubscribe();
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
    this.formControl()?.markAsTouched();
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
      this.formControl()?.disabled ? 'ciui-input--disabled' : '',
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
  private _formControlValueSubscription: Nullable<Subscription> = null;
  private _formControlValueSignal = signal<Nullable<T>>(null);
}
