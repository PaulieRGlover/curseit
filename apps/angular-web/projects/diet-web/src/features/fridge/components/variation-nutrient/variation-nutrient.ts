import { Component, ViewEncapsulation, computed, forwardRef, inject, input } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { CiuiButton, CiuiNumberInput, CiuiSelect } from '@curseit/ciui';
import { Nullable } from '@curseit/types';
import { UNITS } from '@curseit/units';

import { NUTRIENT_UNITS } from '../../../../shared/constants/units';
import { FridgeService } from '../../fridge.service';
import { NutrientsSearchStore } from '../../store/nutrients-search.store';
import { VariationNutrientsStore } from '../../store/variation-nutrients.store';
import { NutrientAbridged } from '../../types/external/nutrient.types';
import { NutrientUnit, VariationNutrientValue } from '../../types/internal/variation.types';

import { nutrientInputToNutrientModel } from './transformers/nutrient-input-to-nutrient-model';
import { nutrientModelToVariationNutrientUpdate } from './transformers/nutrient-model-to-variation-nutrient-update';
import { NutrientInput } from './types/variation-nutrient.types';
import { VariationNutrientValidationService } from './validation/variation-nutrient-validation.service';

@Component({
  selector: 'cid-variation-nutrient',
  imports: [ReactiveFormsModule, CiuiButton, CiuiNumberInput, CiuiSelect],
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

  nutrientForm = new FormGroup({
    core: new FormControl<Nullable<NutrientAbridged>>(null),
    amountValue: new FormControl<VariationNutrientValue>(0, {
      asyncValidators: this.validationService.amountValue,
      nonNullable: true,
    }),
    amountUnit: new FormControl<NutrientUnit>(UNITS.GRAM, {
      asyncValidators: this.validationService.amountUnit,
      nonNullable: true,
    }),
  });

  isNew = computed(() => !this.variationNutrientsStore.getById(this.nutrientInput().id));
  isLoading = computed(() => {
    return this.variationNutrientsStore.isVariationNutrientLoading(this.nutrientInput().id);
  });

  readonly units = NUTRIENT_UNITS;

  ngOnInit() {
    const { core, amountValue, amountUnit } = nutrientInputToNutrientModel(this.nutrientInput());

    if (core) {
      this.nutrientForm.controls.core.setValue(core);
      this.nutrientForm.controls.amountValue.setValue(amountValue);
      this.nutrientForm.controls.amountUnit.setValue(amountUnit);
    }
  }

  async handleChange() {
    const nutrientModel = await this.validationService.nutrientModel(this.nutrientForm.value);
    const variationNutrientUpdate = nutrientModelToVariationNutrientUpdate(nutrientModel);

    if (this.isNew()) {
      this.fridgeService.createVariationNutrient({
        id: this.nutrientInput().id,
        ...variationNutrientUpdate,
      });
    } else {
      this.fridgeService.updateVariationNutrient(this.nutrientInput().id, variationNutrientUpdate);
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
