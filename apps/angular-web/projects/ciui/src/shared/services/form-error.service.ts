import { Injectable, computed, signal } from '@angular/core';
import {
  AbstractControl,
  PristineChangeEvent,
  StatusChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';

import { Subscription } from 'rxjs';

@Injectable()
export class FormErrorService {
  readonly errors = computed(() => this._errors());
  readonly isTouched = computed(() => this._isTouched());
  readonly hasErrors = computed(() => this._errors().length > 0 && this._isTouched());
  readonly hasOneError = computed(() => this._errors().length === 1);
  readonly firstError = computed(() => this._errors()[0]);
  readonly tempFormattedErrors = computed(() => {
    return this._errors()
      .map(error => `- ${error}`)
      .join('\n')
  });

  initialize(control: AbstractControl) {
    this._sub = control.events.subscribe(event => {
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

  ngOnDestroy() {
    this._sub?.unsubscribe();
  }

  private _errors = signal<string[]>([]);
  private _isTouched = signal(false);
  private _sub?: Subscription;

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
