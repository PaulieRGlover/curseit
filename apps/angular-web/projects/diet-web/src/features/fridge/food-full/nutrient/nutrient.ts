import { Component, Input, ViewEncapsulation, booleanAttribute, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { CiuiIcon, CiuiInput, CiuiInputSelect } from '@curseit/ciui';
import { MaybeUndefined } from '@curseit/types';
import { UNITS } from '@curseit/units';

import { NutrientDto } from '../../dto/internal/nutrient.dto';

@Component({
  selector: 'cid-nutrient',
  imports: [ReactiveFormsModule, CiuiInput, CiuiInputSelect, CiuiIcon],
  templateUrl: './nutrient.html',
  styleUrl: './nutrient.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CidNutrient),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cid-food-nutrient',
  },
})
export class CidNutrient implements ControlValueAccessor {
  name = new FormControl('');
  value = new FormControl([0, UNITS.GRAM]);

  valueOptions = [UNITS.GRAM, UNITS.MICROGRAM, UNITS.MILLIGRAM];

  @Input({ transform: booleanAttribute }) isNew = false;
  @Input() nutrient: MaybeUndefined<NutrientDto>;

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected onChange = (value: any) => {};
  protected onTouched = () => {};
}
