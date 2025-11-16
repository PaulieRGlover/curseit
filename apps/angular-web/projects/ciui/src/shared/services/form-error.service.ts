import { Injectable, computed, signal } from '@angular/core';
import {
  AbstractControl,
  PristineChangeEvent,
  StatusChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';
import { Nullable } from '@curseit/types';

import { Subscription } from 'rxjs';

@Injectable()
export class FormErrorService {
  readonly errors = computed(() => {
    return [...new Set([...this._errors()])];
  });
  readonly isTouched = computed(() => this._isTouched());
  readonly hasErrors = computed(() => this._errors().length > 0 && this._isTouched());
  readonly hasOneError = computed(() => this._errors().length === 1);
  readonly firstError = computed(() => this._errors()[0]);

  initialize(control: AbstractControl) {
    this._controlEventsSubscription = control.events.subscribe(event => {
      switch (true) {
        case event instanceof StatusChangeEvent: {
          this._errors.set(this.computeErrors(control));
          break;
        }
        case event instanceof TouchedChangeEvent: {
          this._errors.set(this.computeErrors(control));
          this._isTouched.set(event.touched);
          break;
        }
        case event instanceof PristineChangeEvent: {
          if (event.pristine) {
            this._isTouched.set(false);
          }

          break;
        }
      }
    });
  }

  ngOnDestroy() {
    this._controlEventsSubscription?.unsubscribe();
  }

  private _errors = signal<string[]>([]);
  private _isTouched = signal(false);
  private _controlEventsSubscription: Nullable<Subscription> = null;

  private computeErrors(control: AbstractControl) {
    return control.errors
      ? Object.keys(control.errors)
          .map(key => {
            const errorDescription = control.errors?.[key];
            return typeof errorDescription === 'string' ? errorDescription : '';
          })
          .filter(error => error)
      : [];
  }
}
