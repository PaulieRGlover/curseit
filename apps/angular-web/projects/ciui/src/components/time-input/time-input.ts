import {
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { Nullable } from '@curseit/types';

import { CiuiBaseInput } from '../../shared/components/base-input/base-input';
import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import {
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  WEEK,
} from '../../shared/constants/time';
import { FormErrorService } from '../../shared/services/form-error.service';

export const AVERAGE_MONTH = 30 * DAY; // not accurately average but expected by user
export const AVERAGE_YEAR = 365 * DAY; // same as above

export type TimeUnit =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';

const REFINEMENT_MAP: Record<TimeUnit, { regex: RegExp; unitInMs: number }> = {
  year: { regex: /-?(\d+) ?(years?)(?![a-z])/i, unitInMs: AVERAGE_YEAR },
  month: { regex: /-?(\d+) ?(months?)(?![a-z])/, unitInMs: AVERAGE_MONTH },
  week: { regex: /-?(\d+) ?(w|weeks?)(?![a-z])/i, unitInMs: WEEK },
  day: { regex: /-?(\d+) ?(d|days?)(?![a-z])/i, unitInMs: DAY },
  hour: { regex: /-?(\d+) ?(h|hours?)(?![a-z])/i, unitInMs: HOUR },
  minute: { regex: /-?(\d+) ?(m|min|minutes?)(?![a-z])/i, unitInMs: MINUTE },
  second: { regex: /-?(\d+) ?(s|sec|seconds?)(?![a-z])/i, unitInMs: SECOND },
  millisecond: { regex: /-?(\d+) ?(ms|milliseconds?)(?![a-z])/i, unitInMs: 1 },
};

const FULL_REFINEMENT: Array<TimeUnit> = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond',
];

@Component({
  selector: 'ciui-time-input',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './time-input.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiTimeInput),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiTimeInput extends CiuiBaseInput<number> {
  autocomplete = input<string>('off');
  refinementSource = input<Nullable<TimeUnit>>(null, { alias: 'refinement' });
  minRefinement = input<TimeUnit>('millisecond');
  maxRefinement = input<TimeUnit>('year');

  activeElements = computed(() => [this._inputRef().nativeElement]);

  constructor() {
    super();
  }

  onInput(event: Event) {
    this._resetAngryDelete();
    const elementValue = (event.target as HTMLInputElement).value;
    const newValue = this._parseTimeFromUserInput(elementValue);

    this._onChange(newValue);
    this.input.emit(newValue);
  }

  onChange(event: Event) {
    const elementValue = (event.target as HTMLInputElement).value;
    const newValue = this._parseTimeFromUserInput(elementValue);

    this.change.emit(newValue);
  }

  applyWrite(value: any) {
    this._renderer.setProperty(
      this._inputRef().nativeElement,
      'value',
      this._parseUserInputFromTime(value),
    );
  }

  private _refinement = computed<Array<TimeUnit>>(() => {
    const refinementSource_ = this.refinementSource();
    return !refinementSource_
      ? FULL_REFINEMENT.filter((_unit, index) => {
          const minRefinementIndex = FULL_REFINEMENT.findIndex(
            unit => unit === this.minRefinement(),
          );
          const maxRefinementIndex = FULL_REFINEMENT.findIndex(
            unit => unit === this.maxRefinement(),
          );
          return index >= maxRefinementIndex && index <= minRefinementIndex;
        })
      : [refinementSource_];
  });

  private _parseTimeFromUserInput(input: string): number {
    return this._refinement().reduce<number>((time, unit) => {
      const { regex, unitInMs } = REFINEMENT_MAP[unit];
      return time + parseFloat(input.match(regex)?.[1] ?? '0') * unitInMs;
    }, 0);
  }

  private _parseUserInputFromTime(time: number): string {
    return this._refinement()
      .reduce(
        ({ time, unitAmounts }, unit) => {
          const { unitInMs } = REFINEMENT_MAP[unit];
          const amount = Math.floor(time / unitInMs);

          if (amount) {
            unitAmounts.push(`${amount} ${unit}${amount === 1 ? '' : 's'}`);
          }

          return { time: time - amount * unitInMs, unitAmounts };
        },
        { time, unitAmounts: [] as Array<string> },
      )
      .unitAmounts.join(', ');
  }

  protected _inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
}
