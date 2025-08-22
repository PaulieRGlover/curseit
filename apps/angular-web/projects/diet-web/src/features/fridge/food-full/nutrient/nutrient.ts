import {
  Component,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { CiuiIcon, CiuiInputSelect, CiuiSelect } from '@curseit/ciui';
import { Nullable } from '@curseit/types';
import { UNITS, Unit } from '@curseit/units';

import { NutrientInput } from '../../dto/internal/nutrient.dto';
import { NutrientInternalValidationService } from '../../validation/nutrient-internal-validation.service';
import { FridgeService } from '../../fridge.service';
import { NutrientsSearchStore } from '../../store/nutrients-search.store';

@Component({
  selector: 'cid-nutrient',
  imports: [ReactiveFormsModule, CiuiSelect, CiuiInputSelect, CiuiIcon],
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
  fridgeService = inject(FridgeService);
  validationService = inject(NutrientInternalValidationService);
  nutrientsSearchStore = inject(NutrientsSearchStore);

  name = new FormControl('', { asyncValidators: this.validationService.name });
  value = new FormControl<[number, Unit]>([0, UNITS.GRAM], {
    asyncValidators: this.validationService.valueUnit,
  });

  id = signal<Nullable<NutrientInput['id']>>(null);
  valueOptions = [UNITS.GRAM, UNITS.MICROGRAM, UNITS.MILLIGRAM];

  isNew = input<boolean, any>(false, { transform: booleanAttribute });

  async handleInputChange() {
    const newValue = {
      id: this.id(),
      name: this.name.value,
      value: this.value.value?.[0],
      unit: this.value.value?.[1],
    };
    const foodInput = await this.validationService.nutrient(newValue);

    if (foodInput) {
      this._onChange(foodInput);
    }
  }

  handleSearchDebounced(value: string) {
    this.fridgeService.searchNutrients(value);
  }

  writeValue(value: NutrientInput) {
    this.id.set(value.id);
    this.name.setValue(value.name);
    this.value.setValue([value.value, value.unit]);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  protected _onChange = (value: any) => {};
  protected _onTouched = () => {};
}
