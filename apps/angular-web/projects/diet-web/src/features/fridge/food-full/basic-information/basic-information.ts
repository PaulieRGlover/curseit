import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CiuiCheckbox, CiuiInput, CiuiTextarea } from '@curseit/ciui';

import { FoodsInternalValidationService } from '../../validation/foods-internal-validation.service';
import { FridgeService } from '../../fridge.service';
import { MaybeUndefined } from '@curseit/types';

@Component({
  selector: 'cid-basic-information',
  imports: [ReactiveFormsModule, CiuiInput, CiuiTextarea, CiuiCheckbox],
  templateUrl: './basic-information.html',
  styleUrl: './basic-information.scss',
  host: {
    class: 'cid-food-basic-information',
  },
  encapsulation: ViewEncapsulation.None,
})
export class CidBasicInformation {
  private foodsValidationService = inject(FoodsInternalValidationService);
  private fridgeService = inject(FridgeService);

  @Input() food: MaybeUndefined<any>;

  foodData = new FormGroup({
    name: new FormControl('', { asyncValidators: this.foodsValidationService.name }),
    description: new FormControl(''),
    perishable: new FormControl(true),
  });

  loading = false;

  async handleChange() {
    const foodData = this.foodData.value!;
    const food = await this.foodsValidationService.foodCreate(foodData);

    if (!this.food && food) {
      this.fridgeService.create(food);
    }
  }
}
