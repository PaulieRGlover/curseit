import { Component, inject } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Nullable } from '@curseit/types';

import { NutrientInput } from '../../dto/internal/nutrient.dto';
import { FridgeService } from '../../fridge.service';
import { NutrientsStore } from '../../store/nutrients.store';
import { CidNutrient } from '../nutrient/nutrient';
import { nutrientInputToNutrientCreate } from '../../transformers/nutrient.transformers';

@Component({
  selector: 'cid-nutrients',
  imports: [ReactiveFormsModule, CidNutrient],
  templateUrl: './nutrients.html',
})
export class CidNutrients {
  fridgeService = inject(FridgeService);
  nutrientsStore = inject(NutrientsStore);

  nutrients = new FormArray<FormControl<NutrientInput>>([]);

  handleNutrientChange(nutrient: NutrientInput) {
    if (nutrient.id) {

    } else {
      this.fridgeService.createVariationNutrient(nutrientInputToNutrientCreate(nutrient));
    }
  }

  constructor() {
    this._nutrientsSubscription = this.nutrientsStore.nutrientInputs$.subscribe(nutrients => {
      if (!nutrients) {
        return;
      }

      this.nutrients.clear();

      nutrients.forEach(nutrient => {
        this.nutrients.push(new FormControl(nutrient, { nonNullable: true }));
      });

      this.nutrients.push(
        new FormControl({ name: '', value: 0, unit: 'g' }, { nonNullable: true }),
      );
    });
  }

  ngOnDestroy() {
    this._nutrientsSubscription?.unsubscribe();
  }

  private _nutrientsSubscription: Nullable<Subscription> = null;
}
