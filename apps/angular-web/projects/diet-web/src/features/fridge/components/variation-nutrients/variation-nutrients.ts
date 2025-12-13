import { Component, HostBinding, ViewEncapsulation, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { VariationNutrientsStore } from '../../store/variation-nutrients.store';
import { CidVariationNutrient } from '../variation-nutrient/variation-nutrient';

import type { NewNutrientModel } from './types/variation-nutrients.types';

@Component({
  selector: 'cid-variation-nutrients',
  imports: [ReactiveFormsModule, CidVariationNutrient],
  templateUrl: './variation-nutrients.html',
  styleUrl: './variation-nutrients.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidVariationNutrients {
  variationNutrientsStore = inject(VariationNutrientsStore);

  nutrients = computed(() => {
    return [...(this.variationNutrientsStore.variationNutrients() ?? []), this._getEmptyNutrient()];
  });

  @HostBinding('class')
  hostClass = 'cid-variation-nutrients';

  private _getEmptyNutrient(): NewNutrientModel {
    return {
      id: uuidv4(),
      name: '',
      valueInGrams: 0,
      valueDisplayUnit: 'g',
      nutrientId: null,
    };
  }
}
