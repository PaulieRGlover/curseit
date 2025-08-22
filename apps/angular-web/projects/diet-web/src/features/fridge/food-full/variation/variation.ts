import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { CiuiInputSelect, CiuiLoader } from '@curseit/ciui';
import { ENERGY, ENERGY_ARRAY, UNITS } from '@curseit/units';

import { VariationStore } from '../../store/variation.store';
import { CidNutrients } from '../nutrients/nutrients';

@Component({
  selector: 'cid-variation',
  imports: [ReactiveFormsModule, CidNutrients, CiuiInputSelect, CiuiLoader],
  templateUrl: './variation.html',
  styleUrl: './variation.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cid-food-variation',
  },
})
export class CidVariation {
  variationStore = inject(VariationStore);

  referenceSize = new FormControl([100, UNITS.GRAM]);
  energy = new FormControl([100, ENERGY.KILOCALORIE]);

  referenceSizeOptions = [UNITS.GRAM, UNITS.KILOGRAM, UNITS.OUNCE, UNITS.POUND];
  energyOptions = [...ENERGY_ARRAY];
}
