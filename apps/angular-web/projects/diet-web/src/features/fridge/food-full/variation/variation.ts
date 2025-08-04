import { Component, ViewEncapsulation } from '@angular/core';

import { CiuiInputSelect } from '@curseit/ciui';

import { CidNutrients } from '../nutrients/nutrients';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ENERGY, ENERGY_ARRAY, UNITS } from '@curseit/units';

@Component({
  selector: 'cid-variation',
  imports: [ReactiveFormsModule, CidNutrients, CiuiInputSelect],
  templateUrl: './variation.html',
  styleUrl: './variation.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'cid-food-variation',
  },
})
export class CidVariation {
  referenceSize = new FormControl([100, UNITS.GRAM]);
  energy = new FormControl([100, ENERGY.KILOCALORIE]);

  referenceSizeOptions = [UNITS.GRAM, UNITS.KILOGRAM, UNITS.OUNCE, UNITS.POUND];
  energyOptions = [...ENERGY_ARRAY];
}
