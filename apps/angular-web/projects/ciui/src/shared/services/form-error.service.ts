import { Injectable, computed, signal } from '@angular/core';
import {
  AbstractControl,
  PristineChangeEvent,
  StatusChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';

@Injectable()
export class FormErrorService {
  private _errors = signal<string[]>([]);
  private _isTouched = signal(false);

  readonly errors = computed(() => this._errors());
  readonly isTouched = computed(() => this._isTouched());
  readonly hasErrors = computed(() => this._errors().length > 0 && this._isTouched());
  readonly firstError = computed(() => this._errors()[0]);

  initialize(control: AbstractControl) {
    control.events.subscribe(event => {
      switch (true) {
        case event instanceof StatusChangeEvent: {
          this._errors.set(this.computeErrors(control));
          break;
        }
        case event instanceof TouchedChangeEvent: {
          this._errors.set(this.computeErrors(control));
          this._isTouched.set(true);
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
