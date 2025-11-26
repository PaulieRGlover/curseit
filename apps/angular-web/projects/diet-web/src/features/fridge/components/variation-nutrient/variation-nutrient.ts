import { Component, ViewEncapsulation, forwardRef, inject, input, output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { CiuiButton, CiuiInputSelect, CiuiSelect } from '@curseit/ciui';
import { Nullable } from '@curseit/types';
import { UNITS, Unit } from '@curseit/units';

import { NUTRIENT_UNITS } from '../../constants/units';
import { FridgeService } from '../../fridge.service';
import { NutrientsSearchStore } from '../../store/nutrients-search.store';
import { VariationNutrientsStore } from '../../store/variation-nutrients.store';
import { NutrientAbridged } from '../../types/external/nutrient.types';
import {
  VariationNutrientListItem,
  VariationNutrientListItemUpdate,
} from '../variation-nutrients/types/variation-nutrient-list-item.types';

import { variationNutrientInputUpdateToVariationNutrientListItemUpdate } from './transformers/variation-nutrient-input-to-variation-nutrient-list-item-update.transformer';
import { variationNutrientListItemToVariationNutrientInput } from './transformers/variation-nutrient-list-item-to-variation-nutrient-input.transformer';
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
  nutrientsStore = inject(VariationNutrientsStore);
  nutrientsSearchStore = inject(NutrientsSearchStore);

  variationNutrient = input.required<VariationNutrientListItem>();

  update = output<VariationNutrientListItemUpdate>();

  nutrient = new FormControl<Nullable<NutrientAbridged>>(null);
  amount = new FormControl<[number, Unit]>([0, UNITS.GRAM], {
    asyncValidators: this.validationService.amount,
  });

  readonly units = NUTRIENT_UNITS;

  ngOnInit() {
    const variationNutrientInput = variationNutrientListItemToVariationNutrientInput(
      this.variationNutrient(),
    );
    if (variationNutrientInput.nutrientId) {
      this.nutrient.setValue({
        id: variationNutrientInput.nutrientId,
        name: variationNutrientInput.name,
      });

      this.amount.setValue(variationNutrientInput.amount);
    }
  }

  async handleInputChange() {
    if (!this.nutrient.value?.id) {
      return;
    }

    const nutrientInputUpdate = await this.validationService.variationNutrientInputUpdate({
      name: this.nutrient.value?.name,
      amount: this.amount.value,
      nutrientId: this.nutrient.value.id,
    });

    this.update.emit(
      variationNutrientInputUpdateToVariationNutrientListItemUpdate(nutrientInputUpdate),
    );
  }

  handleSearch(value?: string) {
    this.fridgeService.searchNutrients(value);
  }

  handleAngryDelete() {
    const variationNutrient = this.variationNutrient();
    if (variationNutrient.id) {
      this.fridgeService.deleteVariationNutrient(variationNutrient.id);
    }
  }
}
