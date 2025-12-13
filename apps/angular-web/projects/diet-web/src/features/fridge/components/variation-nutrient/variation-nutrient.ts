import { Component, ViewEncapsulation, computed, forwardRef, inject, input } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { CiuiButton, CiuiInputSelect, CiuiSelect } from '@curseit/ciui';
import { Nullable } from '@curseit/types';
import { UNITS } from '@curseit/units';

import { NUTRIENT_UNITS } from '../../constants/units';
import { FridgeService } from '../../fridge.service';
import { NutrientsSearchStore } from '../../store/nutrients-search.store';
import { VariationNutrientsStore } from '../../store/variation-nutrients.store';
import { NutrientAbridged } from '../../types/external/nutrient.types';
import { Unit } from '../../types/internal/variation.types';

import { nutrientInputToNutrient } from './transformers/nutrient-input-to-nutrient';
import { nutrientToVariationNutrientUpdate } from './transformers/nutrient-to-variation-nutrient-update';
import { NutrientInput } from './types/variation-nutrient.types';
import { VariationNutrientValidationService } from './validation/variation-nutrient-validation.service';

@Component({
  selector: 'cid-variation-nutrient',
  imports: [ReactiveFormsModule, CiuiSelect, CiuiInputSelect, CiuiButton],
  templateUrl: './variation-nutrient.html',
  styleUrl: './variation-nutrient.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CidVariationNutrient),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cid-variation-nutrient',
  },
})
export class CidVariationNutrient {
  fridgeService = inject(FridgeService);
  validationService = inject(VariationNutrientValidationService);
  variationNutrientsStore = inject(VariationNutrientsStore);
  nutrientsSearchStore = inject(NutrientsSearchStore);

  nutrientInput = input.required<NutrientInput>({ alias: 'nutrient' });

  nutrient = new FormGroup({
    core: new FormControl<Nullable<NutrientAbridged>>(null),
    amount: new FormControl<[number, Unit]>([0, UNITS.GRAM], {
      asyncValidators: this.validationService.amount,
      nonNullable: true,
    }),
  });

  isNew = computed(() => !this.variationNutrientsStore.getById(this.nutrientInput().id));
  isLoading = computed(() => {
    return this.variationNutrientsStore.isVariationNutrientLoading(this.nutrientInput().id);
  });

  readonly units = NUTRIENT_UNITS;

  ngOnInit() {
    const { core, amount } = nutrientInputToNutrient(this.nutrientInput());

    if (core) {
      this.nutrient.controls.core.setValue(core);
      this.nutrient.controls.amount.setValue(amount);
    }
  }

  async handleChange() {
    if (this.isNew()) {
      this.fridgeService.createVariationNutrient({
        id: this.nutrientInput().id,
        ...nutrientToVariationNutrientUpdate(this.nutrient.getRawValue()),
      });
    } else {
      this.fridgeService.updateVariationNutrient(
        this.nutrientInput().id,
        nutrientToVariationNutrientUpdate(this.nutrient.getRawValue()),
      );
    }
  }

  handleSearch(value?: string) {
    this.fridgeService.searchNutrients(value);
  }

  handleAngryDelete() {
    const variationNutrient = this.nutrientInput();
    if (variationNutrient.id) {
      this.fridgeService.removeVariationNutrient(variationNutrient.id);
    }
  }
}
